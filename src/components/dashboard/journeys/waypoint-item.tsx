import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { formatTime, generateTimes } from '@/lib/utils'
import { Waypoint } from '@/interfaces/journey'
import {
  WaypointSchema,
  waypointResolver,
  waypointDefaultValues,
} from '@/schemas/journey'
import { updateWaypoint, deleteWaypoint, getWaypoint } from '@/services/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { toast } from '@/components/ui/toast'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Dropdown } from '@/components/ui/dropdown'
import { confirmation } from '@/components/ui/confirmation'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'

interface Props {
  onRefresh: () => void
  waypoint: Waypoint
}

export function WaypointItem({ onRefresh, waypoint }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const update = useDisclosure()
  const times = generateTimes()

  const form = useForm<WaypointSchema>({
    mode: 'onChange',
    resolver: waypointResolver,
    defaultValues: waypointDefaultValues,
  })

  const handleUpdate = async (data: WaypointSchema) => {
    try {
      const { title } = await updateWaypoint(waypoint.id, data)
      toast.success(
        t('journey.itinerary.updated-waypoint-message', {
          title: title[locale],
        }),
      )
      update.onClose()
      form.reset(waypointDefaultValues)
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  const handleEdit = async () => {
    const waypointEdit = await getWaypoint(waypoint.id)
    form.reset({
      time: waypointEdit.time,
      title: waypointEdit.title,
      description: waypointEdit.description,
      routeId: waypointEdit.routeId,
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
        const { title } = await deleteWaypoint(waypoint.id)
        toast.success(
          t('journey.itinerary.deleted-waypoint-message', {
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
    <div className='flex gap-3'>
      <div className='bg-dotted-line'>
        <div className='shadow-main-small bg-abstract-navy flex size-8 items-center justify-center rounded-full'>
          <Icons.Waypoint className='size-6 text-white' />
        </div>
      </div>
      <div className='flex flex-1 flex-col pb-4'>
        <div className='flex items-center gap-4'>
          <span className='flex-1 text-base leading-5.5 font-medium'>
            {waypoint.title}
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
        <span className='text-sm leading-5'>{waypoint.description}</span>
        <span className='text-nevada mt-0.5 text-sm leading-5 font-medium'>
          {formatTime(locale, waypoint.time)}
        </span>
      </div>
      <Modal
        variant='manage'
        title={t('journey.itinerary.update-waypoint-title')}
        isOpen={update.isOpen}
        onClose={update.onClose}
        actions={[
          {
            type: 'action',
            text: t('journey.itinerary.save-label'),
            onClick: form.handleSubmit(handleUpdate),
            disabled: form.formState.isSubmitting,
          },
        ]}
      >
        <div className='flex flex-col gap-6'>
          <Controller
            control={form.control}
            name='time'
            render={({ field, fieldState }) => (
              <Select
                ref={field.ref}
                label={t('journey.form-field.time')}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('journey.form-field.select-time')}
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
          <Controller
            control={form.control}
            name='description'
            render={({ field, fieldState }) => (
              <TextareaTranslation
                ref={field.ref}
                label={t('journey.form-field.description')}
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
