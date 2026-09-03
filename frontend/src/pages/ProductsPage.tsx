import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  PackagePlus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  getCategories,
  getProducts,
  type CategoryDto,
  type ProductDto,
} from '../api/masterData'
import { useAuth } from '../components/AuthProvider'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  SearchInput,
} from '../components/UI'
import { formatVnd } from '../utils/format'

export function ProductsPage() {
  const { user } = useAuth()

  const [products, setProducts] = useState<ProductDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [categoryId, setCategoryId] = useState('ALL')

  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    void getCategories()
      .then((data) => {
        setCategories(data.items)
      })
      .catch(() => {
        setCategories([])
      })
  }, [])

  async function loadProducts() {
    setLoading(true)
    setError('')

    try {
      const data = await getProducts({
        page,
        pageSize,
        q: debouncedSearch,
        categoryId:
          categoryId === 'ALL' ? undefined : Number(categoryId),
        isActive:
          status === 'ALL' ? undefined : status === 'ACTIVE',
      })

      setProducts(data.items)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (err) {
      setProducts([])
      setTotal(0)
      setTotalPages(0)
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải danh sách sản phẩm.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [page, pageSize, debouncedSearch, categoryId, status])

  const activeOnPage = useMemo(
    () => products.filter((product) => product.is_active).length,
    [products],
  )

  const outOfStockOnPage = useMemo(
    () => products.filter((product) => product.stock_quantity === 0).length,
    [products],
  )

  const metrics = [
    {
      label: 'Tổng kết quả',
      value: total,
      icon: Boxes,
      gradient: 'from-indigo-500 via-violet-500 to-purple-600',
      glow: 'bg-violet-300/25',
      text: 'text-indigo-700',
    },
    {
      label: 'Đang bán trên trang',
      value: activeOnPage,
      icon: PackageCheck,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      glow: 'bg-emerald-300/25',
      text: 'text-emerald-700',
    },
    {
      label: 'Hết hàng trên trang',
      value: outOfStockOnPage,
      icon: TriangleAlert,
      gradient: 'from-rose-400 via-pink-500 to-fuchsia-500',
      glow: 'bg-rose-300/25',
      text: 'text-rose-700',
    },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Danh mục hàng hóa"
        title="Sản phẩm"
        description="Dữ liệu sản phẩm được tải trực tiếp từ FastAPI/PostgreSQL. Tồn kho chỉ đọc tại màn hình này."
        actions={
          user?.role === 'ADMIN' ? (
            <Button>
              <PackagePlus size={17} /> Thêm sản phẩm
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {metrics.map(
          ({ label, value, icon: Icon, gradient, glow, text }) => (
            <Card
              key={label}
              className="group relative overflow-hidden p-5 transition hover:-translate-y-1"
            >
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${glow}`}
              />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <div
                    className={`text-[11px] font-black uppercase tracking-[0.13em] ${text}`}
                  >
                    {label}
                  </div>

                  <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {value}
                  </div>

                  <div className="mt-2 text-xs font-semibold text-slate-400">
                    Dữ liệu từ PostgreSQL
                  </div>
                </div>

                <div
                  className={`grid h-14 w-14 place-items-center rounded-[1.25rem] bg-gradient-to-br ${gradient} text-white shadow-lg transition group-hover:scale-105 group-hover:rotate-3`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </Card>
          ),
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="relative flex flex-col gap-3 border-b border-violet-100/70 bg-gradient-to-r from-white via-violet-50/45 to-sky-50/45 p-4 lg:flex-row lg:items-center">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

          <div className="max-w-xl flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm theo mã hoặc tên sản phẩm..."
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
            />

            <select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value)
                setPage(1)
              }}
              className="rounded-2xl border border-violet-100 bg-white/90 py-3 pl-9 pr-8 text-sm font-black text-slate-700 outline-none shadow-sm focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60"
            >
              <option value="ALL">Tất cả nhóm hàng</option>

              {categories
                .filter((category) => category.is_active)
                .map((category) => (
                  <option
                    value={category.id}
                    key={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
            />

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="rounded-2xl border border-violet-100 bg-white/90 py-3 pl-9 pr-8 text-sm font-black text-slate-700 outline-none shadow-sm focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngừng bán</option>
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              void loadProducts()
            }}
          >
            <RefreshCw size={16} />
            Làm mới
          </Button>

          <div className="hidden items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-slate-400 ring-1 ring-slate-200/60 xl:flex">
            <Search size={15} className="text-indigo-400" />
            Tìm kiếm phía backend
          </div>
        </div>

        {error && (
          <div className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm font-bold text-slate-400">
            Đang tải dữ liệu từ PostgreSQL...
          </div>
        ) : products.length ? (
          <>
            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Nhóm hàng</th>
                    <th>Giá bán</th>
                    <th>Giá nhập</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${
                              index % 3 === 0
                                ? 'from-indigo-500 to-violet-600'
                                : index % 3 === 1
                                  ? 'from-emerald-500 to-cyan-600'
                                  : 'from-amber-400 to-orange-500'
                            } text-xs font-black text-white shadow-sm`}
                          >
                            {product.name.charAt(0)}
                          </div>

                          <div>
                            <div className="font-black text-slate-900">
                              {product.name}
                            </div>

                            <div className="mt-1 text-xs font-black text-violet-600">
                              {product.code}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="rounded-xl bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700">
                          {product.category_name}
                        </span>
                      </td>

                      <td className="font-black text-slate-900">
                        {formatVnd(Number(product.selling_price))}
                      </td>

                      <td>
                        {formatVnd(Number(product.purchase_price))}
                      </td>

                      <td>
                        <Badge
                          tone={
                            product.stock_quantity === 0
                              ? 'red'
                              : product.stock_quantity <= 10
                                ? 'amber'
                                : 'green'
                          }
                        >
                          {product.stock_quantity} sản phẩm
                        </Badge>
                      </td>

                      <td>
                        <Badge
                          tone={product.is_active ? 'green' : 'slate'}
                        >
                          {product.is_active
                            ? 'Đang bán'
                            : 'Ngừng bán'}
                        </Badge>
                      </td>

                      <td>
                        {user?.role === 'ADMIN' ? (
                          <button className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-100">
                            Chỉnh sửa
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            Chỉ xem
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-violet-100/70 bg-white/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-bold text-slate-500">
                Tổng {total} sản phẩm · Trang {page}/
                {Math.max(totalPages, 1)}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft size={16} />
                  Trước
                </Button>

                <Button
                  variant="secondary"
                  disabled={totalPages === 0 || page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Sau
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Không có sản phẩm phù hợp"
            description="Hãy đổi bộ lọc hoặc từ khóa tìm kiếm."
          />
        )}
      </Card>
    </div>
  )
}
