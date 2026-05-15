import { use } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { generateTimes } from '@/lib/utils'
import {
  WaypointSchema,
  waypointResolver,
  waypointDefaultValues,
} from '@/schemas/journey'
import { Waypoint } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { createWaypoint } from '@/services/journey'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'
import { WaypointItem } from './waypoint-item'

interface Props {
  routeId: string
  waypointsPromise: Promise<Waypoint[]>
  onRefresh: () => void
}

export function WaypointsList({ routeId, waypointsPromise, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const create = useDisclosure()
  const times = generateTimes()
  const waypoints = use(waypointsPromise)

  const form = useForm<WaypointSchema>({
    mode: 'onChange',
    resolver: waypointResolver,
    defaultValues: {
      ...waypointDefaultValues,
      routeId,
    },
  })

  const handleCreate = async (data: WaypointSchema) => {
    try {
      const { title } = await createWaypoint(data)
      toast.success(
        t('journey.itinerary.created-waypoint-message', {
          title: title[locale],
        }),
      )
      create.onClose()
      form.reset({
        ...waypointDefaultValues,
        routeId,
      })
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2 pl-1'>
        {waypoints.map((waypoint) => {
          return (
            <WaypointItem
              key={waypoint.id}
              onRefresh={onRefresh}
              waypoint={waypoint}
            />
          )
        })}
      </div>
      <Button widthFit icon='Plus' onClick={create.onOpen}>
        {t('journey.itinerary.add-waypoint-label')}
      </Button>
      <Modal
        variant='manage'
        title={t('journey.itinerary.create-waypoint-title')}
        isOpen={create.isOpen}
        onClose={create.onClose}
        actions={[
          {
            type: 'action',
            text: t('journey.itinerary.create-waypoint-label'),
            onClick: form.handleSubmit(handleCreate),
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
