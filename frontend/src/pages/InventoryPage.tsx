import { AlertTriangle, History, LockKeyhole } from 'lucide-react'
import { Badge, Card, PageHeader } from '../components/UI'
import { products } from '../data/demo'

const movements = [
  { id: 1, code: 'SP001', type: 'PURCHASE', delta: 20, ref: 'PN00000017', actor: 'admin', time: '29/08/2026 09:15' },
  { id: 2, code: 'SP001', type: 'SALE', delta: -2, ref: 'HD00000081', actor: 'sales', time: '30/08/2026 20:42' },
  { id: 3, code: 'SP003', type: 'SALE', delta: -1, ref: 'HD00000080', actor: 'sales', time: '30/08/2026 18:05' },
  { id: 4, code: 'SP004', type: 'SALE_CANCEL', delta: 1, ref: 'HD00000078', actor: 'admin', time: '29/08/2026 11:15' },
]

export function InventoryPage() {
  return <div>
    <PageHeader eyebrow="Kho hàng" title="Tồn kho" description="Tồn kho chỉ đọc. Không có nút chỉnh tồn trực tiếp; tồn chỉ thay đổi qua xác nhận hóa đơn, phiếu nhập hoặc hủy hóa đơn." actions={<div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600"><LockKeyhole size={16} /> Chỉ đọc</div>} />
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800"><AlertTriangle className="mr-2 inline" size={18} /> `inventory` là nguồn tồn hiện tại duy nhất. Giao diện sản phẩm chỉ hiển thị số tồn đọc từ kho.</div>
    <div className="grid gap-6 xl:grid-cols-[1fr_.95fr]">
      <Card className="overflow-hidden"><div className="border-b border-slate-200 p-4 font-black text-slate-900">Tồn hiện tại</div><div className="table-shell"><table><thead><tr><th>Sản phẩm</th><th>Nhóm</th><th>Số lượng</th><th>Cảnh báo</th></tr></thead><tbody>{products.map((p) => <tr key={p.id}><td><div className="font-black text-slate-900">{p.name}</div><div className="mt-1 text-xs font-bold text-indigo-600">{p.code}</div></td><td>{p.category}</td><td className="text-lg font-black">{p.stock}</td><td><Badge tone={p.stock === 0 ? 'red' : p.stock <= 10 ? 'amber' : 'green'}>{p.stock === 0 ? 'Hết hàng' : p.stock <= 10 ? 'Sắp hết' : 'Ổn định'}</Badge></td></tr>)}</tbody></table></div></Card>
      <Card className="overflow-hidden"><div className="flex items-center gap-2 border-b border-slate-200 p-4 font-black text-slate-900"><History size={18} /> Lịch sử biến động</div><div className="table-shell"><table><thead><tr><th>Sản phẩm</th><th>Loại</th><th>Thay đổi</th><th>Tham chiếu</th></tr></thead><tbody>{movements.map((m) => <tr key={m.id}><td className="font-bold">{m.code}</td><td><Badge tone={m.type === 'SALE' ? 'red' : m.type === 'PURCHASE' ? 'green' : 'blue'}>{m.type}</Badge></td><td className={`font-black ${m.delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{m.delta > 0 ? '+' : ''}{m.delta}</td><td><div className="font-bold text-slate-800">{m.ref}</div><div className="mt-1 text-xs text-slate-400">{m.actor} · {m.time}</div></td></tr>)}</tbody></table></div></Card>
    </div>
  </div>
}
