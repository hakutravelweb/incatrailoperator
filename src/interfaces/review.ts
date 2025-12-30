export interface Review {
  id: string
  rating: number
  traveller: Traveller
  comment: string
  createdAt: Date
}

export interface Traveller {
  fullname: string
  email: string
  country: string
}
