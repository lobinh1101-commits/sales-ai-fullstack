import { Bot, CheckCircle2, Send, Sparkles, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, PageHeader } from '../components/UI'
import { products } from '../data/demo'
import { formatVnd } from '../utils/format'

export function AiProductAdvicePage() {
  const [need, setNeed] = useState('Tai nghe dưới 500k, pin lâu')
  const [answer, setAnswer] = useState(false)
  const result = products.filter((p) => p.active && p.stock > 0 && p.sellingPrice <= 500000).slice(0, 3)
  return <div>
    <PageHeader eyebrow="AI hỗ trợ bán hàng" title="AI tư vấn sản phẩm" description="Người dùng chỉ gửi nhu cầu. Khi tích hợp thật, backend tự lọc sản phẩm active, còn hàng và build context chính thức cho AI." actions={<Badge tone="violet">Mock AI</Badge>} />
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-300/25 blur-[60px]" />
        <div className="relative">
          <div className="grid h-13 w-13 h-14 w-14 place-items-center rounded-[1.3rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow"><WandSparkles size={24} /></div>
          <div className="mt-5 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700">Nhu cầu khách hàng</div>
          <h3 className="mt-2 text-xl font-black text-slate-950">Khách hàng đang cần gì?</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">Nhập nhu cầu tự nhiên. Không gửi bảng tồn kho hay dữ liệu chính thức từ frontend.</p>
          <textarea value={need} onChange={(e) => setNeed(e.target.value.slice(0,1000))} rows={7} className="mt-5 w-full resize-none rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-indigo-50/55 p-4 text-sm font-semibold outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/60" />
          <div className="mt-2 flex items-center justify-between"><span className="text-xs font-semibold text-slate-400">Tối đa 1000 ký tự</span><span className="text-xs font-black text-violet-500">{need.length}/1000</span></div>
          <div className="mt-4"><Button onClick={() => setAnswer(true)}><Send size={17} /> Nhận gợi ý</Button></div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-200/25 blur-[70px]" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 text-white shadow-lg"><Bot size={21} /></div>
          <div><h3 className="font-black text-slate-950">Kết quả tư vấn</h3><p className="text-xs font-semibold text-slate-500">Tối đa 3 sản phẩm, không bịa giá/tồn.</p></div>
        </div>
        {!answer ? <div className="relative grid min-h-[360px] place-items-center text-center"><div><div className="relative mx-auto grid h-20 w-20 place-items-center rounded-[2rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow"><div className="absolute -inset-5 rounded-[2.5rem] bg-violet-300/20 blur-2xl"/><Sparkles className="relative" size={31} /></div><p className="mt-5 font-black text-slate-800">Chưa có yêu cầu tư vấn</p><p className="mt-1 text-sm font-medium text-slate-500">Nhập nhu cầu và bấm “Nhận gợi ý”.</p></div></div> : <div className="relative mt-6 space-y-3">{result.map((p, i) => <div key={p.id} className="group rounded-3xl border border-violet-100 bg-gradient-to-r from-white via-indigo-50/35 to-fuchsia-50/35 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${i === 0 ? 'from-amber-400 to-orange-500' : i === 1 ? 'from-indigo-500 to-violet-600' : 'from-emerald-500 to-cyan-600'} text-sm font-black text-white shadow-sm`}>{i+1}</div><div><div className="text-[10px] font-black uppercase tracking-wider text-violet-600">{p.code}</div><div className="mt-1 text-base font-black text-slate-950">{p.name}</div></div></div><Badge tone="green">Còn {p.stock}</Badge></div><div className="mt-4 flex items-center justify-between rounded-2xl bg-white/75 px-3 py-2.5 ring-1 ring-violet-100"><div className="text-sm font-black text-violet-700">{formatVnd(p.sellingPrice)}</div><div className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14}/> Phù hợp điều kiện</div></div><p className="mt-3 text-sm font-medium leading-6 text-slate-500">Phù hợp ngân sách và đang còn hàng trong dữ liệu demo được backend giả lập lọc trước.</p></div>)}</div>}
      </Card>
    </div>
  </div>
}
