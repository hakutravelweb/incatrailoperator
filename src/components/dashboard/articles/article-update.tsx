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
import { InputTranslate } from '@/components/ui/input-translate'
import { TextareaTranslate } from '@/components/ui/textarea-translate'
import { InputListTranslate } from '@/components/ui/input-list-translate'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { EditorTranslate } from '@/components/ui/editor-translate'

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
            {form.watch(`title.${locale}`)}
          </strong>
        </div>
        <Button
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
            <InputTranslate
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
            <InputTranslate
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
            <TextareaTranslate
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
            <InputListTranslate
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
            <EditorTranslate
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
              emptyMessage={
                categories.data.length === 0 ? t('article.empty-message') : ''
              }
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
