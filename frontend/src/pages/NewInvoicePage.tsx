import { CheckCircle2, Minus, Plus, Save, ShoppingBag, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card, PageHeader, Button, Badge } from '../components/UI'
import { customers, products } from '../data/demo'
import { formatVnd } from '../utils/format'

type Line = { productId: number; quantity: number }

export function NewInvoicePage() {
  const available = products.filter((p) => p.active && p.stock > 0)
  const [customerId, setCustomerId] = useState('')
  const [discount, setDiscount] = useState(0)
  const [payment, setPayment] = useState('CASH')
  const [lines, setLines] = useState<Line[]>([{ productId: available[0].id, quantity: 1 }])

  const subtotal = useMemo(() => lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId)
    return sum + (product?.sellingPrice ?? 0) * line.quantity
  }, 0), [lines])
  const total = Math.max(0, subtotal - discount)

  const addLine = () => setLines((current) => [...current, { productId: available[0].id, quantity: 1 }])
  const update = (index: number, patch: Partial<Line>) => setLines((current) => current.map((line, i) => i === index ? { ...line, ...patch } : line))
  const remove = (index: number) => setLines((current) => current.filter((_, i) => i !== index))

  return (
    <div>
      <PageHeader eyebrow="Bán hàng" title="Lập hóa đơn mới" description="Bản giao diện mô phỏng DRAFT. Khi tích hợp backend, giá và tồn chính thức sẽ được đọc lại tại thời điểm xác nhận." actions={<Badge tone="amber">DRAFT</Badge>} />
      <div className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div><h3 className="font-black text-slate-950">Sản phẩm trong hóa đơn</h3><p className="mt-1 text-sm text-slate-500">Mỗi sản phẩm có số lượng lớn hơn 0.</p></div><Button variant="secondary" onClick={addLine}><Plus size={17} /> Thêm dòng</Button></div>
          <div className="space-y-3">
            {lines.map((line, index) => {
              const product = products.find((p) => p.id === line.productId)!
              return <div key={`${line.productId}-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_150px_150px_44px] md:items-center">
                <select value={line.productId} onChange={(e) => update(index, { productId: Number(e.target.value) })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-indigo-400">
                  {available.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </select>
                <div className="flex items-center justify-between rounded-xl bg-white px-2 py-1 ring-1 ring-slate-200"><button onClick={() => update(index, { quantity: Math.max(1, line.quantity - 1) })} className="p-2"><Minus size={15} /></button><span className="font-black">{line.quantity}</span><button onClick={() => update(index, { quantity: Math.min(product.stock, line.quantity + 1) })} className="p-2"><Plus size={15} /></button></div>
                <div className="text-right font-black text-slate-900">{formatVnd(product.sellingPrice * line.quantity)}</div>
                <button disabled={lines.length === 1} onClick={() => remove(index)} className="grid h-10 w-10 place-items-center rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-30"><Trash2 size={17} /></button>
              </div>
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h3 className="font-black text-slate-950">Thông tin thanh toán</h3>
            <div className="mt-5 space-y-4">
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Khách hàng</span><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-400"><option value="">Khách lẻ</option>{customers.filter((c) => c.active).map((c) => <option value={c.id} key={c.id}>{c.code} — {c.fullName}</option>)}</select></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Phương thức</span><select value={payment} onChange={(e) => setPayment(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-400"><option value="CASH">Tiền mặt</option><option value="BANK_TRANSFER">Chuyển khoản</option><option value="CARD">Thẻ</option></select></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Giảm giá (VND)</span><input type="number" min={0} max={subtotal} value={discount} onChange={(e) => setDiscount(Math.min(subtotal, Math.max(0, Number(e.target.value))))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-400" /></label>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="space-y-3 p-5"><div className="flex justify-between text-sm text-slate-500"><span>Tạm tính</span><span className="font-bold text-slate-800">{formatVnd(subtotal)}</span></div><div className="flex justify-between text-sm text-slate-500"><span>Giảm giá</span><span className="font-bold text-rose-600">-{formatVnd(discount)}</span></div><div className="h-px bg-slate-200" /><div className="flex items-end justify-between"><span className="font-black text-slate-900">Tổng thanh toán</span><span className="text-2xl font-black text-indigo-700">{formatVnd(total)}</span></div></div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-slate-50 p-4"><Button variant="secondary" onClick={() => alert('Đã mô phỏng lưu DRAFT.')}><Save size={17} /> Lưu nháp</Button><Button onClick={() => window.confirm('Xác nhận hóa đơn? Backend thật sẽ kiểm tra lại giá và tồn kho.') && alert('Đây là giao diện demo, chưa trừ tồn thật.')}><CheckCircle2 size={17} /> Xác nhận</Button></div>
          </Card>
          <div className="rounded-2xl bg-indigo-50 p-4 text-xs leading-5 text-indigo-800"><ShoppingBag size={17} className="mb-2" /> Frontend chỉ hiển thị preview. Giá, tổng tiền và tồn kho chính thức phải do backend xác nhận.</div>
        </div>
      </div>
    </div>
  )
}
