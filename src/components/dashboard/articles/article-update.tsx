'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { ArticleSchema, articleResolver } from '@/schemas/article'
import { updateArticle, getArticle } from '@/services/article'
import { useCategories } from '@/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Select } from '@/components/ui/select'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'
import { InputListTranslation } from '@/components/ui/input-list-translation'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { EditorTranslation } from '@/components/ui/editor-translation'

interface Props {
  articleId: string
  onClose: () => void
  onRefresh: () => void
}

export function ArticleUpdate({ articleId, onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<ArticleSchema>({
    mode: 'all',
    resolver: articleResolver,
    defaultValues: async (): Promise<ArticleSchema> => {
      const article = await getArticle(articleId)

      return {
        slug: article.slug,
        photo: null,
        previewPhoto: article.photo,
        title: article.title,
        introduction: article.introduction,
        labels: article.labels,
        content: article.content,
        authorId: article.authorId,
        categoryId: article.categoryId,
      }
    },
  })
  const { isDirty, isValid } = form.formState

  const categories = useCategories()

  const handleUpdate = async (data: ArticleSchema) => {
    try {
      const { title } = await updateArticle(articleId, data)
      toast.success(
        t('article.updated-message', {
          title: title[locale],
        }),
      )
      onClose()
      onRefresh()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('DUPLICATED_SLUG_ERROR_LOCALES')) {
          toast.error(error.message)
        }
      }
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
      <div className='z-overlay sticky top-0 flex flex-col justify-between gap-4 bg-white py-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <button
            onClick={onClose}
            className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
          >
            <Icons.Left className='size-5' />
          </button>
          <span className='text-lg leading-6 font-bold'>
            {form.watch(`title.${locale}`)}
          </span>
        </div>
        <Button
          widthFit
          disabled={!isDirty || !isValid || form.formState.isSubmitting}
          onClick={form.handleSubmit(handleUpdate)}
        >
          {t('article.update-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='slug'
          render={({ field, formState }) => (
            <InputTranslation
              ref={field.ref}
              label={t('article.form-field.slug')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='photo'
          render={({ field, fieldState }) => (
            <UploadPhoto
              ref={field.ref}
              label={t('article.form-field.photo')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              previewPhoto={form.watch('previewPhoto')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='title'
          render={({ field, formState }) => (
            <InputTranslation
              ref={field.ref}
              label={t('article.form-field.title')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='introduction'
          render={({ field, formState }) => (
            <TextareaTranslation
              ref={field.ref}
              label={t('article.form-field.introduction')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='labels'
          render={({ field, formState }) => (
            <InputListTranslation
              ref={field.ref}
              label={t('article.form-field.labels')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
              addListText={t('input-list.add-list')}
              deleteText={t('input-list.actions.delete')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='content'
          render={({ field, formState }) => (
            <EditorTranslation
              ref={field.ref}
              label={t('article.form-field.content')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='categoryId'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('article.form-field.category')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('article.form-field.select-category')}
              invalid={fieldState.invalid}
              emptyMessage={t('article.empty-message')}
            >
              {categories.data.map((category) => {
                return (
                  <Select.Option key={category.id} value={category.id}>
                    {category.title}
                  </Select.Option>
                )
              })}
            </Select>
          )}
        />
      </div>
    </div>
  )
}
