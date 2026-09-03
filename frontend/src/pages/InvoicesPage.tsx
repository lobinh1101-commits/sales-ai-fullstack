import { Ban, Eye, Plus, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { Badge, Button, Card, PageHeader } from '../components/UI'
import { invoices } from '../data/demo'
import { formatVnd } from '../utils/format'

const tone = (status: string) => status === 'COMPLETED' ? 'green' : status === 'DRAFT' ? 'amber' : 'red'
const label = (status: string) => status === 'COMPLETED' ? 'Hoàn tất' : status === 'DRAFT' ? 'Nháp' : 'Đã hủy'

export function InvoicesPage() {
  const { user } = useAuth()
  return (
    <div>
      <PageHeader
        eyebrow="Bán hàng"
        title="Hóa đơn"
        description="Theo dõi hóa đơn theo trạng thái. Chỉ SALES được lập/xác nhận hóa đơn; chỉ ADMIN được hủy hóa đơn đã hoàn tất."
        actions={user?.role === 'SALES' ? <Link to="/invoices/new"><Button><Plus size={17} /> Lập hóa đơn</Button></Link> : undefined}
      />
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><ReceiptText size={18} /> Danh sách hóa đơn</div>
          <div className="text-xs font-semibold text-slate-400">page=1 · page_size=20</div>
        </div>
        <div className="table-shell"><table><thead><tr><th>Mã hóa đơn</th><th>Khách hàng</th><th>Người tạo</th><th>Thanh toán</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thời gian</th><th></th></tr></thead><tbody>
          {invoices.map((item) => <tr key={item.id}>
            <td className="font-black text-indigo-700">{item.code}</td><td>{item.customer}</td><td>{item.creator}</td>
            <td><Badge tone="blue">{item.payment === 'CASH' ? 'Tiền mặt' : item.payment === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Thẻ'}</Badge></td>
            <td className="font-black text-slate-900">{formatVnd(item.total)}</td><td><Badge tone={tone(item.status)}>{label(item.status)}</Badge></td><td>{item.createdAt}</td>
            <td><div className="flex items-center gap-2"><button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Xem chi tiết"><Eye size={17} /></button>{user?.role === 'ADMIN' && item.status === 'COMPLETED' && <button onClick={() => window.confirm(`Hủy hóa đơn ${item.code}? Giao diện demo chưa thay đổi dữ liệu thật.`)} className="rounded-xl p-2 text-rose-600 hover:bg-rose-50" title="Hủy hóa đơn"><Ban size={17} /></button>}</div></td>
          </tr>)}
        </tbody></table></div>
      </Card>
    </div>
  )
}
