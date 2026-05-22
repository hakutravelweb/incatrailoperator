export interface Review {
  id: string
  rating: number
  traveller: Traveller
  comment: string
  locale: string
  createdAt: Date
}

export interface Traveller {
  fullname: string
  email: string
  country: string
}
