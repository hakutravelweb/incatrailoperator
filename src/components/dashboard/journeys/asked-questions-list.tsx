import { use } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import {
  AskedQuestionSchema,
  askedQuestionResolver,
  askedQuestionDefaultValues,
} from '@/schemas/asked-question'
import { AskedQuestion } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { createAskedQuestion } from '@/services/asked-question'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'
import { AskedQuestionItem } from './asked-question-item'

interface Props {
  journeyId: string
  askedQuestionsPromise: Promise<AskedQuestion[]>
  onRefresh: () => void
}

export function AskedQuestiosList({
  journeyId,
  askedQuestionsPromise,
  onRefresh,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const create = useDisclosure()
  const askedQuestions = use(askedQuestionsPromise)

  const form = useForm<AskedQuestionSchema>({
    mode: 'onChange',
    resolver: askedQuestionResolver,
    defaultValues: {
      ...askedQuestionDefaultValues,
      journeyId,
    },
  })

  const handleCreate = async (data: AskedQuestionSchema) => {
    try {
      const { title } = await createAskedQuestion(data)
      toast.success(
        t('journey.asked-question.created-message', {
          title: title[locale],
        }),
      )
      create.onClose()
      form.reset({
        ...askedQuestionDefaultValues,
        journeyId,
      })
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  return (
    <div className='flex flex-col'>
      {askedQuestions.length === 0 && (
        <Button icon='Plus' onClick={create.onOpen}>
          {t('journey.asked-question.add-label')}
        </Button>
      )}
      {askedQuestions.length > 0 && (
        <div className='flex flex-col gap-4'>
          <div className='divide-chinese-white border-y-chinese-white divide-y border-y'>
            {askedQuestions.map((askedQuestion, index) => {
              return (
                <AskedQuestionItem
                  key={index}
                  askedQuestion={askedQuestion}
                  onRefresh={onRefresh}
                />
              )
            })}
          </div>
          <Button widthFit icon='Plus' onClick={create.onOpen}>
            {t('journey.asked-question.add-label')}
          </Button>
        </div>
      )}
      <Modal
        variant='manage'
        title={t('journey.asked-question.create-title')}
        isOpen={create.isOpen}
        onClose={create.onClose}
        actions={[
          {
            type: 'action',
            text: t('journey.asked-question.create-label'),
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
