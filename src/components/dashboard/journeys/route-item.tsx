import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Route } from '@/interfaces/journey'
import {
  RouteSchema,
  routeResolver,
  routeDefaultValues,
} from '@/schemas/journey'
import { updateRoute, deleteRoute, getRoute } from '@/services/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { toast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'
import { Dropdown } from '@/components/ui/dropdown'
import { confirmation } from '@/components/ui/confirmation'
import { InputTranslation } from '@/components/ui/input-translation'
import { Waypoints } from './waypoints'

interface Props {
  showDottedLine?: boolean
  onRefresh: () => void
  route: Route
}

export function RouteItem({ showDottedLine, onRefresh, route }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const waypoints = useDisclosure()
  const update = useDisclosure()

  const form = useForm<RouteSchema>({
    mode: 'onChange',
    resolver: routeResolver,
    defaultValues: routeDefaultValues,
  })

  const handleUpdate = async (data: RouteSchema) => {
    try {
      const { title } = await updateRoute(route.id, data)
      toast.success(
        t('journey.itinerary.updated-route-message', {
          title: title[locale],
        }),
      )
      update.onClose()
      form.reset(routeDefaultValues)
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  const handleEdit = async () => {
    const routeEdit = await getRoute(route.id)
    form.reset({
      title: routeEdit.title,
      journeyId: routeEdit.journeyId,
    })
    update.onOpen()
  }

  const handleDelete = async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      try {
        const { title } = await deleteRoute(route.id)
        toast.success(
          t('journey.itinerary.deleted-route-message', {
            title: title[locale],
          }),
        )
        onRefresh()
      } catch {
        toast.error('ERROR INTERNAL SERVER')
      }
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex gap-3'>
        <div className='bg-dotted-line'>
          <div className='shadow-main-small flex size-8 items-center justify-center rounded-full bg-white'>
            <Icons.Route className='size-6' />
          </div>
        </div>
        <div
          className={cn('flex flex-1 gap-4', {
            'pb-8': waypoints.isOpen,
            'pb-12': showDottedLine && !waypoints.isOpen,
          })}
        >
          <span
            onClick={waypoints.onToggle}
            className='flex-1 cursor-pointer text-base leading-5.5 font-medium'
          >
            {route.title}
          </span>
          <Dropdown variant='manage'>
            <Dropdown.Trigger>
              <Icons.Dots className='size-5' />
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Option onClick={handleEdit}>
                {t('actions.edit')}
              </Dropdown.Option>
              <Dropdown.Option danger onClick={handleDelete}>
                {t('actions.delete')}
              </Dropdown.Option>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
      {waypoints.isOpen && <Waypoints routeId={route.id} />}
      <Modal
        variant='manage'
        title={t('journey.itinerary.update-route-title')}
        isOpen={update.isOpen}
        onClose={update.onClose}
        actions={[
          {
            type: 'action',
            text: t('editor.save-label'),
            onClick: form.handleSubmit(handleUpdate),
            disabled: form.formState.isSubmitting,
          },
        ]}
      >
        <div className='flex flex-col gap-6'>
          <Controller
            control={form.control}
            name='title'
            render={({ field, fieldState }) => (
              <InputTranslation
                ref={field.ref}
                label={t('journey.form-field.title')}
                value={field.value}
                onChange={field.onChange}
                errors={fieldState.error}
              />
            )}
          />
        </div>
      </Modal>
    </div>
  )
}
