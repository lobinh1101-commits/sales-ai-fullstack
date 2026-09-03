import { CheckCircle2, Plus, Save, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, Button, Card, PageHeader } from '../components/UI'
import { products } from '../data/demo'
import { formatVnd } from '../utils/format'

type Row = { productId: number; quantity: number; unitCost: number }

export function NewPurchaseReceiptPage() {
  const active = products.filter((p) => p.active)
  const [rows, setRows] = useState<Row[]>([{ productId: active[0].id, quantity: 10, unitCost: active[0].purchasePrice }])
  const total = useMemo(() => rows.reduce((sum, row) => sum + row.quantity * row.unitCost, 0), [rows])
  const add = () => setRows((r) => [...r, { productId: active[0].id, quantity: 1, unitCost: active[0].purchasePrice }])
  const patch = (i: number, change: Partial<Row>) => setRows((r) => r.map((row, index) => index === i ? { ...row, ...change } : row))
  return <div>
    <PageHeader eyebrow="Nhập hàng" title="Lập phiếu nhập mới" description="Khi xác nhận, backend thật sẽ tăng tồn atomically và cập nhật giá nhập gần nhất cho từng sản phẩm." actions={<Badge tone="amber">DRAFT</Badge>} />
    <div className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
      <Card className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-black">Chi tiết nhập hàng</h3><p className="mt-1 text-sm text-slate-500">Số lượng &gt; 0, đơn giá nhập ≥ 0.</p></div><Button variant="secondary" onClick={add}><Plus size={17} /> Thêm dòng</Button></div><div className="space-y-3">{rows.map((row, i) => <div key={i} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_110px_180px_130px_44px] md:items-center"><select value={row.productId} onChange={(e) => { const id = Number(e.target.value); const p = products.find((x) => x.id === id)!; patch(i, { productId: id, unitCost: p.purchasePrice }) }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold">{active.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}</select><input type="number" min={1} value={row.quantity} onChange={(e) => patch(i, { quantity: Math.max(1, Number(e.target.value)) })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold" /><input type="number" min={0} value={row.unitCost} onChange={(e) => patch(i, { unitCost: Math.max(0, Number(e.target.value)) })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold" /><div className="text-right font-black">{formatVnd(row.quantity * row.unitCost)}</div><button disabled={rows.length === 1} onClick={() => setRows((r) => r.filter((_, index) => index !== i))} className="grid h-10 w-10 place-items-center rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-30"><Trash2 size={17} /></button></div>)}</div></Card>
      <Card className="h-fit overflow-hidden"><div className="p-6"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng giá trị nhập</div><div className="mt-3 text-3xl font-black text-indigo-700">{formatVnd(total)}</div><div className="mt-5 text-sm leading-6 text-slate-500">Xác nhận phiếu nhập sẽ làm tăng tồn kho. Giao diện demo không tự sửa tồn.</div></div><div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-slate-50 p-4"><Button variant="secondary" onClick={() => alert('Mô phỏng lưu DRAFT.')}><Save size={17} /> Lưu nháp</Button><Button onClick={() => window.confirm('Xác nhận phiếu nhập?') && alert('Demo UI: chưa cập nhật DB thật.')}><CheckCircle2 size={17} /> Xác nhận</Button></div></Card>
    </div>
  </div>
}
