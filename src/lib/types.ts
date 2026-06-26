export interface PokemonCard {
  id: string
  name: string
  set: string
  number: string
  type: string
  rarity: string
  condition: string
  price: number
  quantity: number
  imageUrl: string
  description: string
  isSold: boolean
  createdAt: string
}

export type CardFormData = Omit<PokemonCard, 'id' | 'createdAt' | 'isSold'>

export interface AdminUser {
  passwordHash: string
}
