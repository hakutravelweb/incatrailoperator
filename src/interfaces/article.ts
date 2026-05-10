import { Localization } from '@/shared/interfaces'
import { User } from './user'
import { Category } from './journey'

export interface Article {
  id: string
  slug: string
  title: string
  photo: string
  introduction: string
  labels: string[]
  content: string
  author: User
  category: Category
  createdAt: Date
  localizations: Localization[]
}

export type ArticleView = 'CREATE' | 'EDIT' | 'ARTICLES'
