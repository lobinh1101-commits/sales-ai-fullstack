import { ScrollText } from 'lucide-react'
import { Badge, Card, PageHeader } from '../components/UI'
import { auditRows } from '../data/demo'

export function AuditLogsPage() {
  return <div><PageHeader eyebrow="Truy vết" title="Nhật ký hệ thống" description="Audit log là dữ liệu chỉ đọc, dùng để giải thích actor, action, trạng thái trước/sau và thời điểm thao tác." />
    <Card className="overflow-hidden"><div className="flex items-center gap-2 border-b border-slate-200 p-4 font-black text-slate-900"><ScrollText size={18} /> Audit trail</div><div className="table-shell"><table><thead><tr><th>Actor</th><th>Action</th><th>Đối tượng</th><th>Thay đổi trạng thái</th><th>Thời gian</th></tr></thead><tbody>{auditRows.map((row) => <tr key={row.id}><td className="font-bold">{row.actor}</td><td><Badge tone={row.action.includes('CANCEL') ? 'red' : 'blue'}>{row.action}</Badge></td><td className="font-black text-indigo-700">{row.entity}</td><td>{row.state}</td><td>{row.time}</td></tr>)}</tbody></table></div></Card>
  </div>
}
