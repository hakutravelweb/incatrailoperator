import { Localization, Navigation } from './root'
import { User } from './user'
import { Category } from './attraction-product'

export interface Article {
  id: string
  slug: string
  photo: string
  title: string
  introduction: string
  labels: string[]
  navigation: Navigation[]
  content: string
  author: User
  category: Category
  createdAt: Date
  localizations: Localization[]
}

export type ArticleView = 'CREATE' | 'EDIT' | 'ARTICLES'
