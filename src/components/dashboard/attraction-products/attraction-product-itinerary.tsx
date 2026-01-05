'use client'
import { useTransition, PropsWithChildren } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  UseFieldArrayReturn,
} from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn, generateTimes } from '@/lib/utils'
import {
  ItinerarySchema,
  RouteSchema,
  WaypointSchema,
  itineraryResolver,
  itineraryDefaultValues,
  routeDefaultValues,
  waypointDefaultValues,
} from '@/schemas/attraction-product'
import {
  getAttractionProduct,
  getItinerary,
  saveItinerary,
  deleteRoute,
  deleteWaypoint,
} from '@/services/attraction-product'
import { useDisclosure } from '@/hooks/use-disclosure'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { InputTranslate } from '@/components/ui/input-translate'
import { TextareaTranslate } from '@/components/ui/textarea-translate'
import { Select } from '@/components/ui/select'
import { Dropdown } from '@/components/ui/dropdown'
import { confirmation } from '@/components/ui/confirmation'

interface Props {
  attractionProductId: string
  onClose: () => void
}

export function AttractionProductItinerary({
  attractionProductId,
  onClose,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const getDefaultValues = async (): Promise<ItinerarySchema> => {
    const attractionProduct = await getAttractionProduct(attractionProductId)
    const itinerary = await getItinerary(attractionProductId)
    if (itinerary.length === 0) {
      itineraryDefaultValues.routes[0].attractionProductId = attractionProductId
      return {
        ...itineraryDefaultValues,
        title: attractionProduct.title,
      }
    }

    const routes = itinerary.map<RouteSchema>((route) => {
      const waypoints = route.waypoints.map<WaypointSchema>((waypoint) => {
        return {
          waypointId: waypoint.id,
          time: waypoint.time,
          title: waypoint.title,
          description: waypoint.description,
          routeId: waypoint.routeId,
        }
      })

      return {
        routeId: route.id,
        title: route.title,
        attractionProductId: route.attractionProductId,
        waypoints,
      }
    })

    return {
      title: attractionProduct.title,
      routes: routes,
    }
  }
  const form = useForm<ItinerarySchema>({
    mode: 'all',
    resolver: itineraryResolver,
    defaultValues: getDefaultValues,
  })
  const { isDirty, isValid } = form.formState

  const routes = useFieldArray({
    control: form.control,
    name: 'routes',
  })

  const handleAdd = () => {
    routes.append({
      ...routeDefaultValues,
      attractionProductId,
    })
  }

  const handleChange = async (data: ItinerarySchema) => {
    try {
      await saveItinerary(data)
      toast.success(
        t('attraction.itinerary.saved-message', {
          title: form.watch(`title.${locale}`),
        }),
      )
      const itinerary = await getDefaultValues()
      form.reset(itinerary)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  if (form.formState.isLoading) {
    return (
      <div className='flex justify-center py-2'>
        <Icons.Loading className='size-6' />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='border-b-chinese-white z-overlay sticky top-0 flex flex-col justify-between gap-4 border-b bg-white py-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <button
            onClick={onClose}
            className='bg-anti-flash-white active:bg-chinese-white flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-100'
          >
            <Icons.Left className='size-6' />
          </button>
          <strong className='text-lg leading-6'>
            {t('attraction.itinerary.title', {
              title: form.watch(`title.${locale}`),
            })}
          </strong>
        </div>
        <Button
          disabled={!isDirty || !isValid || form.formState.isSubmitting}
          onClick={form.handleSubmit(handleChange)}
        >
          {t('attraction.itinerary.save-label')}
        </Button>
      </div>
      <div className='flex flex-col items-start gap-6'>
        <div className='rounded-sm border border-black bg-black px-2 py-1 text-xs leading-4 font-bold text-white uppercase'>
          {t('attraction.itinerary.routes')}
        </div>
        <div className='border-chinese-white w-full max-w-2xl rounded-md border p-4'>
          {routes.fields.map((route, index) => {
            return (
              <Route
                key={route.id}
                index={index}
                fields={routes}
                control={form.control}
                route={route}
              >
                <Waypoints
                  control={form.control}
                  index={index}
                  routeId={route.routeId}
                />
              </Route>
            )
          })}
        </div>
        <Button variant='action' onClick={handleAdd}>
          {t('attraction.itinerary.add-route-label')}
        </Button>
      </div>
    </div>
  )
}

interface WaypointsProps {
  control: Control<ItinerarySchema>
  index: number
  routeId: string
}

function Waypoints({ control, index, routeId }: WaypointsProps) {
  const t = useTranslations('Dashboard')
  const waypoints = useFieldArray({
    control,
    name: `routes.${index}.waypoints`,
  })

  return (
    <div className='flex flex-col items-start gap-6'>
      <div className='rounded-sm border border-black px-2 py-1 text-xs leading-4 font-bold uppercase'>
        {t('attraction.itinerary.points')}
      </div>
      <div className='border-chinese-white flex w-full flex-col gap-6 rounded-md border border-dashed p-4'>
        {waypoints.fields.map((waypoint, subindex) => {
          return (
            <Waypoint
              key={waypoint.id}
              index={index}
              subindex={subindex}
              waypoints={waypoints}
              control={control}
              waypoint={waypoint}
            />
          )
        })}
      </div>
      <Button
        variant='action'
        onClick={() => {
          waypoints.append({
            ...waypointDefaultValues,
            routeId,
          })
        }}
      >
        {t('attraction.itinerary.add-point-label')}
      </Button>
    </div>
  )
}

interface WaypointProps {
  index: number
  subindex: number
  waypoints: UseFieldArrayReturn<ItinerarySchema>
  control: Control<ItinerarySchema>
  waypoint: WaypointSchema
}

function Waypoint({
  index,
  subindex,
  waypoints,
  control,
  waypoint,
}: WaypointProps) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const waypointInfo = useDisclosure()
  const [isPending, startTransition] = useTransition()
  const times = generateTimes()

  const handleDelete = (index: number, waypointId: string) => async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      if (waypointId) {
        startTransition(async () => {
          try {
            const { title } = await deleteWaypoint(waypointId)
            toast.success(
              t('attraction.itinerary.deleted-waypoint-message', {
                title: title[locale],
              }),
            )
            waypoints.remove(index)
          } catch {
            toast.error('ERROR INTERNAL SERVER')
          }
        })
      } else {
        waypoints.remove(index)
      }
    }
  }

  return (
    <div className='relative flex items-center justify-center'>
      {isPending && <Icons.Loading className='z-overlay absolute size-6' />}
      <div
        className={cn('flex w-full flex-col gap-2', {
          'pointer-events-none opacity-20': isPending,
        })}
      >
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={waypointInfo.onToggle}
              className='bg-anti-flash-white active:bg-chinese-white flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-100'
            >
              {waypointInfo.isOpen ? (
                <Icons.Up className='size-5' />
              ) : (
                <Icons.Down className='size-5' />
              )}
            </button>
            <div className='rounded-sm border border-dashed border-black px-2 py-1 text-xs leading-4 font-bold uppercase'>
              {t('attraction.itinerary.point-number', {
                number: subindex + 1,
              })}
            </div>
          </div>
          <Dropdown position='top-right'>
            <Dropdown.Trigger>
              <div className='border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex size-8 items-center justify-center rounded-md border-2'>
                <Icons.Dots className='size-4' />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Option
                onClick={handleDelete(subindex, waypoint.waypointId)}
              >
                {t('actions.delete')}
              </Dropdown.Option>
            </Dropdown.Content>
          </Dropdown>
        </div>
        {waypointInfo.isOpen && (
          <div className='flex flex-col gap-4'>
            <Controller
              control={control}
              name={`routes.${index}.waypoints.${subindex}.time`}
              render={({ field, fieldState }) => (
                <Select
                  ref={field.ref}
                  label={t('attraction.form-field.time')}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('attraction.form-field.select-time')}
                  invalid={fieldState.invalid}
                >
                  {times.map((time) => {
                    return (
                      <Select.Option key={time} value={time}>
                        {time}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            />
            <Controller
              control={control}
              name={`routes.${index}.waypoints.${subindex}.title`}
              render={({ field, formState }) => (
                <InputTranslate
                  ref={field.ref}
                  label={t('attraction.form-field.title')}
                  value={field.value}
                  onChange={field.onChange}
                  errors={
                    formState.errors.routes?.[index]?.waypoints?.[subindex]
                      ?.title
                  }
                />
              )}
            />
            <Controller
              control={control}
              name={`routes.${index}.waypoints.${subindex}.description`}
              render={({ field, formState }) => (
                <TextareaTranslate
                  ref={field.ref}
                  label={t('attraction.form-field.description')}
                  value={field.value}
                  onChange={field.onChange}
                  errors={
                    formState.errors.routes?.[index]?.waypoints?.[subindex]
                      ?.description
                  }
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface RouteProps {
  fields: UseFieldArrayReturn<ItinerarySchema>
  control: Control<ItinerarySchema>
  index: number
  route: RouteSchema
}

function Route({
  index,
  fields,
  control,
  route,
  children,
}: PropsWithChildren<RouteProps>) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const routeInfo = useDisclosure()
  const [isPending, startTransition] = useTransition()

  const handleDelete = (index: number, routeId: string) => async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      if (routeId) {
        startTransition(async () => {
          try {
            const { title } = await deleteRoute(routeId)
            toast.success(
              t('attraction.itinerary.deleted-route-message', {
                title: title[locale],
              }),
            )
            fields.remove(index)
          } catch {
            toast.error('ERROR INTERNAL SERVER')
          }
        })
      } else {
        fields.remove(index)
      }
    }
  }

  return (
    <div className='relative flex items-center justify-center'>
      {isPending && <Icons.Loading className='z-overlay absolute size-6' />}
      <div
        className={cn('flex w-full flex-col gap-2', {
          'pointer-events-none opacity-20': isPending,
        })}
      >
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={routeInfo.onToggle}
              className='active:bg-dav-ys-grey hover:bg-dark-charcoal flex size-8 cursor-pointer items-center justify-center rounded-full bg-black text-white transition-colors duration-100 active:text-white/50'
            >
              {routeInfo.isOpen ? (
                <Icons.Up className='size-5' />
              ) : (
                <Icons.Down className='size-5' />
              )}
            </button>
            <div className='bg-anti-flash-white border-chinese-white rounded-sm border px-2 py-1 text-xs leading-4 font-bold uppercase'>
              {t('attraction.itinerary.route-number', {
                number: index + 1,
              })}
            </div>
          </div>
          <Dropdown position='top-right'>
            <Dropdown.Trigger>
              <div className='border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex size-8 items-center justify-center rounded-md border-2'>
                <Icons.Dots className='size-4' />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Option onClick={handleDelete(index, route.routeId)}>
                {t('actions.delete')}
              </Dropdown.Option>
            </Dropdown.Content>
          </Dropdown>
        </div>
        <div className='flex flex-col gap-4'>
          <Controller
            control={control}
            name={`routes.${index}.title`}
            render={({ field, formState }) => (
              <InputTranslate
                ref={field.ref}
                label={t('attraction.form-field.title')}
                value={field.value}
                onChange={field.onChange}
                errors={formState.errors.routes?.[index]?.title}
              />
            )}
          />
          {routeInfo.isOpen && children}
        </div>
      </div>
    </div>
  )
}
