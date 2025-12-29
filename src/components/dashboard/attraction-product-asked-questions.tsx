import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  UseFieldArrayReturn,
} from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import {
  AskedQuestionsSchema,
  AskedQuestionSchema,
  askedQuestionsResolver,
  askedQuestionsDefaultValues,
  askedQuestionDefaultValues,
} from '@/schemas/asked-question'
import { getAttractionProduct } from '@/services/attraction-product'
import {
  getAskedQuestions,
  saveAskedQuestions,
  deleteAskedQuestion,
} from '@/services/asked-question'
import { useDisclosure } from '@/hooks/use-disclosure'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { confirmation } from '@/components/ui/confirmation'
import { Dropdown } from '@/components/ui/dropdown'
import { InputTranslate } from '@/components/ui/input-translate'
import { TextareaTranslate } from '../ui/textarea-translate'

interface Props {
  attractionProductId: string
  onClose: () => void
}

export function AttractionProductAskedQuestions({
  attractionProductId,
  onClose,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const getDefaultValues = async (): Promise<AskedQuestionsSchema> => {
    const attractionProduct = await getAttractionProduct(attractionProductId)
    const askedQuestions = await getAskedQuestions(attractionProductId)

    if (askedQuestions.length === 0) {
      askedQuestionsDefaultValues.askedQuestions[0].attractionProductId =
        attractionProductId
      return {
        ...askedQuestionsDefaultValues,
        title: attractionProduct.title,
      }
    }

    const newAskedQuestions = askedQuestions.map<AskedQuestionSchema>(
      (askedQuestion) => {
        return {
          askedQuestionId: askedQuestion.id,
          title: askedQuestion.title,
          description: askedQuestion.description,
          attractionProductId: askedQuestion.attractionProductId,
        }
      },
    )

    return {
      title: attractionProduct.title,
      askedQuestions: newAskedQuestions,
    }
  }
  const form = useForm<AskedQuestionsSchema>({
    mode: 'all',
    resolver: askedQuestionsResolver,
    defaultValues: getDefaultValues,
  })
  const { isDirty, isValid } = form.formState

  const askedQuestions = useFieldArray({
    control: form.control,
    name: 'askedQuestions',
  })

  const handleAdd = () => {
    askedQuestions.append({
      ...askedQuestionDefaultValues,
      attractionProductId,
    })
  }

  const handleChange = async (data: AskedQuestionsSchema) => {
    try {
      await saveAskedQuestions(data)
      toast.success(
        t('attraction.asked-question.saved-message', {
          title: form.watch(`title.${locale}`),
        }),
      )
      const askedQuestions = await getDefaultValues()
      form.reset(askedQuestions)
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
            {t('attraction.asked-question.title', {
              title: form.watch(`title.${locale}`),
            })}
          </strong>
        </div>
        <Button
          disabled={!isDirty || !isValid || form.formState.isSubmitting}
          onClick={form.handleSubmit(handleChange)}
        >
          {t('attraction.asked-question.save-label')}
        </Button>
      </div>
      <div className='flex flex-col items-start gap-6'>
        <div className='border-chinese-white w-full max-w-2xl rounded-md border p-4'>
          {askedQuestions.fields.map((askedQuestion, index) => {
            return (
              <AskedQuestion
                key={askedQuestion.id}
                index={index}
                fields={askedQuestions}
                control={form.control}
                askedQuestion={askedQuestion}
              />
            )
          })}
        </div>
        <Button variant='action' onClick={handleAdd}>
          {t('attraction.asked-question.add-question-label')}
        </Button>
      </div>
    </div>
  )
}

interface AskedQuestionProps {
  fields: UseFieldArrayReturn<AskedQuestionsSchema>
  control: Control<AskedQuestionsSchema>
  index: number
  askedQuestion: AskedQuestionSchema
}

function AskedQuestion({
  index,
  fields,
  control,
  askedQuestion,
}: AskedQuestionProps) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const askedQuestionInfo = useDisclosure()
  const [isPending, startTransition] = useTransition()

  const handleDelete = (index: number, askedQuestionId: string) => async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      if (askedQuestionId) {
        startTransition(async () => {
          try {
            const { title } = await deleteAskedQuestion(askedQuestionId)
            toast.success(
              t('attraction.asked-question.deleted-question-message', {
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
              onClick={askedQuestionInfo.onToggle}
              className='active:bg-dav-ys-grey hover:bg-dark-charcoal flex size-8 cursor-pointer items-center justify-center rounded-full bg-black text-white transition-colors duration-100 active:text-white/50'
            >
              {askedQuestionInfo.isOpen ? (
                <Icons.Up className='size-5' />
              ) : (
                <Icons.Down className='size-5' />
              )}
            </button>
            <div className='bg-anti-flash-white border-chinese-white rounded-sm border px-2 py-1 text-xs leading-4 font-bold uppercase'>
              {t('attraction.asked-question.question-number', {
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
              <Dropdown.Option
                onClick={handleDelete(index, askedQuestion.askedQuestionId)}
              >
                {t('actions.delete')}
              </Dropdown.Option>
            </Dropdown.Content>
          </Dropdown>
        </div>
        {askedQuestionInfo.isOpen && (
          <div className='flex flex-col gap-4'>
            <Controller
              control={control}
              name={`askedQuestions.${index}.title`}
              render={({ field, formState }) => (
                <InputTranslate
                  ref={field.ref}
                  label={t('attraction.form-field.title')}
                  value={field.value}
                  onChange={field.onChange}
                  errors={formState.errors.askedQuestions?.[index]?.title}
                />
              )}
            />
            <Controller
              control={control}
              name={`askedQuestions.${index}.description`}
              render={({ field, formState }) => (
                <TextareaTranslate
                  ref={field.ref}
                  label={t('attraction.form-field.description')}
                  value={field.value}
                  onChange={field.onChange}
                  errors={formState.errors.askedQuestions?.[index]?.description}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}
