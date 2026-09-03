import { Plus, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { Badge, Button, Card, EmptyState, PageHeader, SearchInput } from '../components/UI'
import { customers } from '../data/demo'
import { formatVnd } from '../utils/format'

export function CustomersPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const rows = useMemo(() => customers.filter((item) => `${item.code} ${item.fullName} ${item.phone} ${item.group}`.toLowerCase().includes(search.toLowerCase())), [search])
  const canWrite = user?.role === 'ADMIN' || user?.role === 'SALES'

  return (
    <div>
      <PageHeader eyebrow="Quan hệ khách hàng" title="Khách hàng" description="Theo dõi hồ sơ khách hàng, nhóm khách hàng và lịch sử mua. Mã khách hàng do backend sinh khi tích hợp thật." actions={canWrite ? <Button><Plus size={17} /> Thêm khách hàng</Button> : undefined} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Tìm mã, tên, số điện thoại, nhóm..." /></div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><UsersRound size={16} /> {customers.length} khách hàng demo</div>
        </div>
        {rows.length ? <div className="table-shell"><table><thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Nhóm</th><th>Tổng mua</th><th>Trạng thái</th><th></th></tr></thead><tbody>
          {rows.map((c) => <tr key={c.id}><td><div className="font-black text-slate-900">{c.fullName}</div><div className="mt-1 text-xs font-bold text-indigo-600">{c.code}</div></td><td>{c.phone}</td><td><Badge tone={c.group === 'VIP' ? 'violet' : c.group === 'Thân thiết' ? 'blue' : 'slate'}>{c.group}</Badge></td><td className="font-bold">{formatVnd(c.totalSpent)}</td><td><Badge tone={c.active ? 'green' : 'slate'}>{c.active ? 'Hoạt động' : 'Tạm ngưng'}</Badge></td><td>{canWrite ? <button className="font-bold text-indigo-600">Chỉnh sửa</button> : <span className="text-slate-400">Chỉ xem</span>}</td></tr>)}
        </tbody></table></div> : <EmptyState title="Không tìm thấy khách hàng" description="Thử từ khóa khác." />}
      </Card>
    </div>
  )
}
