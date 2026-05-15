import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { AskedQuestion } from '@/interfaces/journey'
import {
  AskedQuestionSchema,
  askedQuestionResolver,
  askedQuestionDefaultValues,
} from '@/schemas/asked-question'
import {
  getAskedQuestion,
  updateAskedQuestion,
  deleteAskedQuestion,
} from '@/services/asked-question'
import { useDisclosure } from '@/hooks/use-disclosure'
import { toast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'
import { Dropdown } from '@/components/ui/dropdown'
import { confirmation } from '@/components/ui/confirmation'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'

interface Props {
  askedQuestion: AskedQuestion
  onRefresh: () => void
}

export function AskedQuestionItem({ askedQuestion, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const faqInfo = useDisclosure()
  const update = useDisclosure()

  const form = useForm<AskedQuestionSchema>({
    resolver: askedQuestionResolver,
    defaultValues: askedQuestionDefaultValues,
  })

  const handleEdit = async () => {
    const askedQuestionEdit = await getAskedQuestion(askedQuestion.id)
    form.reset({
      title: askedQuestionEdit.title,
      description: askedQuestionEdit.description,
      journeyId: askedQuestionEdit.journeyId,
    })
    update.onOpen()
  }

  const handleUpdate = async (data: AskedQuestionSchema) => {
    try {
      const { title } = await updateAskedQuestion(askedQuestion.id, data)
      toast.success(
        t('journey.asked-question.updated-message', {
          title: title[locale],
        }),
      )
      update.onClose()
      form.reset(askedQuestionDefaultValues)
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  const handleDelete = async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      try {
        const { title } = await deleteAskedQuestion(askedQuestion.id)
        toast.success(
          t('journey.asked-question.deleted-message', {
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
    <div className='flex flex-col gap-6 py-4'>
      <div className='flex gap-4'>
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
        <button
          onClick={faqInfo.onToggle}
          className='flex flex-1 cursor-pointer items-center justify-between gap-4 text-left hover:underline'
        >
          <span className='text-base leading-5.25 font-bold'>
            {askedQuestion.title}
          </span>
          <Icons.Down
            className={cn('size-5', {
              'rotate-180': faqInfo.isOpen,
            })}
          />
        </button>
      </div>
      {faqInfo.isOpen && (
        <span className='text-dark-charcoal text-sm leading-4.5'>
          {askedQuestion.description}
        </span>
      )}
      <Modal
        variant='manage'
        title={t('journey.asked-question.update-title')}
        isOpen={update.isOpen}
        onClose={update.onClose}
        actions={[
          {
            type: 'action',
            text: t('journey.asked-question.save-label'),
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
