'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import {
  ArticleSchema,
  articleResolver,
  articleDefaultValues,
} from '@/schemas/article'
import { Navigation } from '@/interfaces/root'
import { auth } from '@/services/user'
import { createArticle } from '@/services/article'
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
  onClose: () => void
  onRefresh: () => void
}

export function ArticleCreate({ onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<ArticleSchema>({
    mode: 'all',
    resolver: articleResolver,
    defaultValues: articleDefaultValues,
  })

  const categories = useCategories()

  const handleNavigation = (navigation: Navigation[]) => {
    form.setValue('navigation', navigation)
  }

  const handleCreate = async (data: ArticleSchema) => {
    try {
      const user = await auth()
      data.authorId = user.id
      const { title } = await createArticle(data)
      toast.success(
        t('article.created-message', {
          title: title[locale],
        }),
      )
      onClose()
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
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
            {t('article.new-label')}
          </strong>
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleCreate)}
        >
          {t('article.create-label')}
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
              onNavigation={handleNavigation}
              enabledNavigation
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
