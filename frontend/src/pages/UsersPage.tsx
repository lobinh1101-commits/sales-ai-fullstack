import { Plus, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { Badge, Button, Card, EmptyState, PageHeader, SearchInput } from '../components/UI'
import { demoUsers } from '../data/demo'
import { roleLabel } from '../utils/format'

export function UsersPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const rows = useMemo(() => demoUsers.filter((item) => `${item.fullName} ${item.username} ${item.role}`.toLowerCase().includes(search.toLowerCase())), [search])

  return (
    <div>
      <PageHeader
        eyebrow="Quản trị hệ thống"
        title="Người dùng & phân quyền"
        description="ADMIN được quản lý tài khoản; OWNER chỉ xem. SALES không có quyền truy cập màn hình này."
        actions={user?.role === 'ADMIN' ? <Button><Plus size={17} /> Thêm người dùng</Button> : undefined}
      />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên, username hoặc vai trò..." /></div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck size={16} /> Backend sẽ enforce quyền thật</div>
        </div>
        {rows.length ? (
          <div className="table-shell">
            <table>
              <thead><tr><th>Người dùng</th><th>Username</th><th>Vai trò</th><th>Trạng thái</th><th>Quyền UI</th></tr></thead>
              <tbody>{rows.map((item) => (
                <tr key={item.id}>
                  <td><div className="font-bold text-slate-900">{item.fullName}</div><div className="mt-1 text-xs text-slate-400">ID #{item.id}</div></td>
                  <td className="font-semibold">{item.username}</td>
                  <td><Badge tone={item.role === 'ADMIN' ? 'violet' : item.role === 'SALES' ? 'blue' : 'amber'}>{roleLabel(item.role)}</Badge></td>
                  <td><Badge tone="green">Đang hoạt động</Badge></td>
                  <td>{user?.role === 'ADMIN' ? <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Chỉnh sửa</button> : <span className="text-sm text-slate-400">Chỉ xem</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <EmptyState title="Không tìm thấy người dùng" description="Thử thay đổi từ khóa tìm kiếm." />}
      </Card>
    </div>
  )
}
