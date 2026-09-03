export type Role = 'ADMIN' | 'SALES' | 'OWNER'

export type AuthUser = {
  id: number
  fullName: string
  username: string
  role: Role
}

export type DemoUser = {
  id: number
  fullName: string
  username: string
  role: Role
  password: string
}

export type Product = {
  id: number
  code: string
  name: string
  category: string
  sellingPrice: number
  purchasePrice: number
  stock: number
  active: boolean
}

export type Customer = {
  id: number
  code: string
  fullName: string
  phone: string
  group: string
  totalSpent: number
  active: boolean
}

export type Invoice = {
  id: number
  code: string
  customer: string
  creator: string
  total: number
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED'
  payment: 'CASH' | 'BANK_TRANSFER' | 'CARD'
  createdAt: string
}

export type Receipt = {
  id: number
  code: string
  creator: string
  totalQty: number
  status: 'DRAFT' | 'COMPLETED'
  createdAt: string
}
