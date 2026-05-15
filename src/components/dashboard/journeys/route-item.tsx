import { PropsWithChildren } from 'react'
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
  step: number
  onRefresh: () => void
  route: Route
}

export function RouteItem({ step, onRefresh, route }: Props) {
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
    <div className='relative z-1 flex flex-col gap-4'>
      <div className='bg-inferno absolute top-4 left-3.5 -z-1 h-[calc(100%-32px)] w-1' />
      <div className='flex items-center gap-2'>
        <div
          className={cn(
            'bg-inferno flex size-8 items-center justify-center rounded-full text-white',
            {
              'bg-yellow-sea': step % 2,
            },
          )}
        >
          <span className='text-base leading-5 font-medium'>{step}</span>
        </div>
        <div
          className={cn(
            'border-l-inferno bg-outrageous-orange/10 flex flex-1 gap-4 rounded-lg border-l-4 p-4',
            {
              'border-l-yellow-sea bg-yellow-sea/10': step % 2,
            },
          )}
        >
          <div onClick={waypoints.onToggle} className='flex-1 cursor-pointer'>
            <span className='text-base leading-5 font-bold'>{route.title}</span>
          </div>
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
