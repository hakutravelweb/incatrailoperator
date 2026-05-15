import { use } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import {
  RouteSchema,
  routeResolver,
  routeDefaultValues,
} from '@/schemas/journey'
import { Route } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { createRoute } from '@/services/journey'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { InputTranslation } from '@/components/ui/input-translation'
import { RouteItem } from './route-item'

interface Props {
  journeyId: string
  routesPromise: Promise<Route[]>
  onRefresh: () => void
}

export function RoutesList({ journeyId, routesPromise, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const create = useDisclosure()
  const routes = use(routesPromise)

  const form = useForm<RouteSchema>({
    mode: 'onChange',
    resolver: routeResolver,
    defaultValues: {
      ...routeDefaultValues,
      journeyId,
    },
  })

  const handleCreate = async (data: RouteSchema) => {
    try {
      const { title } = await createRoute(data)
      toast.success(
        t('journey.itinerary.created-route-message', {
          title: title[locale],
        }),
      )
      create.onClose()
      form.reset({
        ...routeDefaultValues,
        journeyId,
      })
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  return (
    <div className='flex flex-col'>
      {routes.length === 0 && (
        <Button icon='Plus' onClick={create.onOpen}>
          {t('journey.itinerary.add-route-label')}
        </Button>
      )}
      {routes.length > 0 && (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            {routes.map((route, index) => {
              return (
                <RouteItem
                  key={route.id}
                  step={index + 1}
                  onRefresh={onRefresh}
                  route={route}
                />
              )
            })}
          </div>
          <Button widthFit icon='Plus' onClick={create.onOpen}>
            {t('journey.itinerary.add-route-label')}
          </Button>
        </div>
      )}
      <Modal
        variant='manage'
        title={t('journey.itinerary.create-route-title')}
        isOpen={create.isOpen}
        onClose={create.onClose}
        actions={[
          {
            type: 'action',
            text: t('journey.itinerary.create-route-label'),
            onClick: form.handleSubmit(handleCreate),
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
