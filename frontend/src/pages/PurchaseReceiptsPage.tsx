import { ClipboardCheck, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { Badge, Button, Card, PageHeader } from '../components/UI'
import { receipts } from '../data/demo'

export function PurchaseReceiptsPage() {
  const { user } = useAuth()
  const canWrite = user?.role === 'ADMIN' || user?.role === 'SALES'
  return <div>
    <PageHeader eyebrow="Nhập hàng" title="Phiếu nhập" description="Phiếu nhập đi theo trạng thái DRAFT → COMPLETED. Baseline không có chức năng hủy phiếu nhập." actions={canWrite ? <Link to="/purchase-receipts/new"><Button><Plus size={17} /> Lập phiếu nhập</Button></Link> : undefined} />
    <Card className="overflow-hidden"><div className="border-b border-slate-200 p-4 text-sm font-bold text-slate-700"><span className="inline-flex items-center gap-2"><ClipboardCheck size={18} /> Danh sách phiếu nhập</span></div><div className="table-shell"><table><thead><tr><th>Mã phiếu</th><th>Người tạo</th><th>Tổng số lượng</th><th>Trạng thái</th><th>Thời gian</th><th></th></tr></thead><tbody>{receipts.map((item) => <tr key={item.id}><td className="font-black text-indigo-700">{item.code}</td><td>{item.creator}</td><td className="font-bold">{item.totalQty}</td><td><Badge tone={item.status === 'COMPLETED' ? 'green' : 'amber'}>{item.status === 'COMPLETED' ? 'Hoàn tất' : 'Nháp'}</Badge></td><td>{item.createdAt}</td><td>{canWrite && item.status === 'DRAFT' ? <button className="font-bold text-indigo-600">Chỉnh sửa</button> : <span className="text-slate-400">Chi tiết</span>}</td></tr>)}</tbody></table></div></Card>
  </div>
}
