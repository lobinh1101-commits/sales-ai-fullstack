import { apiRequest } from './client'

export type PageResponse<T> = {
  items: T[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

export type CategoryDto = {
  id: number
  code: string
  name: string
  is_active: boolean
}

export type ProductDto = {
  id: number
  code: string
  name: string
  category_id: number
  category_name: string
  selling_price: string
  purchase_price: string
  description: string | null
  is_active: boolean
  stock_quantity: number
}

export async function getCategories() {
  return apiRequest<PageResponse<CategoryDto>>('/categories')
}

export async function getProducts(params: {
  page?: number
  pageSize?: number
  q?: string
  categoryId?: number
  isActive?: boolean
}) {
  const search = new URLSearchParams()

  search.set('page', String(params.page ?? 1))
  search.set('page_size', String(params.pageSize ?? 10))

  if (params.q?.trim()) {
    search.set('q', params.q.trim())
  }

  if (params.categoryId) {
    search.set('category_id', String(params.categoryId))
  }

  if (params.isActive !== undefined) {
    search.set('is_active', String(params.isActive))
  }

  return apiRequest<PageResponse<ProductDto>>(
    `/products?${search.toString()}`,
  )
}
