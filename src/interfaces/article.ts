import { User } from './user'
import { Category } from './attraction-product'

export interface Article {
  id: string
  slug: string
  photo: string
  title: string
  description: string
  labels: string[]
  content: string
  author: User
  category: Category
}

export type ArticleView = 'CREATE' | 'EDIT' | 'ARTICLES'
