import { Boxes, PackageCheck, PackagePlus, Search, SlidersHorizontal, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { Badge, Button, Card, EmptyState, PageHeader, SearchInput } from '../components/UI'
import { products } from '../data/demo'
import { formatVnd } from '../utils/format'

export function ProductsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const rows = useMemo(() => products.filter((item) => {
    const matchesSearch = `${item.code} ${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === 'ALL' || (status === 'ACTIVE' ? item.active : !item.active)
    return matchesSearch && matchesStatus
  }), [search, status])

  const metrics = [
    { label: 'Tổng sản phẩm', value: products.length, icon: Boxes, gradient: 'from-indigo-500 via-violet-500 to-purple-600', glow: 'bg-violet-300/25', text: 'text-indigo-700' },
    { label: 'Đang kinh doanh', value: products.filter((p) => p.active).length, icon: PackageCheck, gradient: 'from-emerald-400 via-teal-500 to-cyan-500', glow: 'bg-emerald-300/25', text: 'text-emerald-700' },
    { label: 'Hết hàng', value: products.filter((p) => p.stock === 0).length, icon: TriangleAlert, gradient: 'from-rose-400 via-pink-500 to-fuchsia-500', glow: 'bg-rose-300/25', text: 'text-rose-700' },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Danh mục hàng hóa"
        title="Sản phẩm"
        description="Quản lý nhóm hàng, sản phẩm, giá bán, giá nhập và trạng thái. Tồn kho được hiển thị chỉ đọc và không chỉnh trực tiếp tại đây."
        actions={user?.role === 'ADMIN' ? <Button><PackagePlus size={17} /> Thêm sản phẩm</Button> : undefined}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon, gradient, glow, text }) => (
          <Card key={label} className="group relative overflow-hidden p-5 transition hover:-translate-y-1">
            <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${glow}`} />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className={`text-[11px] font-black uppercase tracking-[0.13em] ${text}`}>{label}</div>
                <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</div>
                <div className="mt-2 text-xs font-semibold text-slate-400">Dữ liệu giao diện demo</div>
              </div>
              <div className={`grid h-13 w-13 h-14 w-14 place-items-center rounded-[1.25rem] bg-gradient-to-br ${gradient} text-white shadow-lg transition group-hover:scale-105 group-hover:rotate-3`}>
                <Icon size={23} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="relative flex flex-col gap-3 border-b border-violet-100/70 bg-gradient-to-r from-white via-violet-50/45 to-sky-50/45 p-4 md:flex-row md:items-center">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
          <div className="max-w-xl flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Tìm theo mã, tên, nhóm hàng..." /></div>
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-violet-100 bg-white/90 py-3 pl-9 pr-8 text-sm font-black text-slate-700 outline-none shadow-sm focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60">
              <option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Đang bán</option><option value="INACTIVE">Ngừng bán</option>
            </select>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-slate-400 ring-1 ring-slate-200/60 lg:flex"><Search size={15} className="text-indigo-400" /> Tìm kiếm phía backend khi tích hợp thật</div>
        </div>
        {rows.length ? <div className="table-shell"><table><thead><tr><th>Sản phẩm</th><th>Nhóm hàng</th><th>Giá bán</th><th>Giá nhập</th><th>Tồn kho</th><th>Trạng thái</th><th></th></tr></thead><tbody>
          {rows.map((p, index) => <tr key={p.id}>
            <td><div className="flex items-center gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${index % 3 === 0 ? 'from-indigo-500 to-violet-600' : index % 3 === 1 ? 'from-emerald-500 to-cyan-600' : 'from-amber-400 to-orange-500'} text-xs font-black text-white shadow-sm`}>{p.name.charAt(0)}</div><div><div className="font-black text-slate-900">{p.name}</div><div className="mt-1 text-xs font-black text-violet-600">{p.code}</div></div></div></td>
            <td><span className="rounded-xl bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700">{p.category}</span></td><td className="font-black text-slate-900">{formatVnd(p.sellingPrice)}</td><td>{formatVnd(p.purchasePrice)}</td>
            <td><Badge tone={p.stock === 0 ? 'red' : p.stock <= 10 ? 'amber' : 'green'}>{p.stock} sản phẩm</Badge></td>
            <td><Badge tone={p.active ? 'green' : 'slate'}>{p.active ? 'Đang bán' : 'Ngừng bán'}</Badge></td>
            <td>{user?.role === 'ADMIN' ? <button className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-100">Chỉnh sửa</button> : <span className="text-xs font-semibold text-slate-400">Chỉ xem</span>}</td>
          </tr>)}
        </tbody></table></div> : <EmptyState title="Không có sản phẩm phù hợp" description="Hãy đổi bộ lọc hoặc từ khóa." />}
      </Card>
    </div>
  )
}
