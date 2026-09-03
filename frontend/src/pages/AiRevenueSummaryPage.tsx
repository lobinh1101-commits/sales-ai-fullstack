import { Bot, Sparkles, TrendingUp, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, PageHeader } from '../components/UI'
import { invoices, topProducts } from '../data/demo'
import { formatVnd } from '../utils/format'

export function AiRevenueSummaryPage() {
  const [generated, setGenerated] = useState(false)
  const revenue = invoices.filter((x) => x.status === 'COMPLETED').reduce((s,x) => s+x.total,0)
  return <div><PageHeader eyebrow="AI phân tích" title="AI nhận xét doanh thu" description="Backend tính report trước; AI chỉ tóm tắt, diễn giải và đưa khuyến nghị tư vấn từ facts đã được kiểm soát." actions={<Badge tone="violet">Validated output</Badge>} />
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-fuchsia-200/30 blur-[55px]" />
        <div className="relative grid h-14 w-14 place-items-center rounded-[1.3rem] bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-600 text-white shadow-glow"><WandSparkles size={23} /></div>
        <div className="relative mt-5 inline-flex rounded-full bg-fuchsia-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-fuchsia-700">Kỳ phân tích</div>
        <h3 className="relative mt-2 text-xl font-black text-slate-950">Chọn kỳ phân tích</h3>
        <div className="relative mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label><span className="mb-2 block text-sm font-black text-slate-700">Từ ngày</span><input type="date" defaultValue="2026-08-01" className="w-full rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-indigo-50/50 px-4 py-3 font-bold text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100/50" /></label>
          <label><span className="mb-2 block text-sm font-black text-slate-700">Đến ngày</span><input type="date" defaultValue="2026-09-01" className="w-full rounded-2xl border border-fuchsia-100 bg-gradient-to-r from-white to-fuchsia-50/45 px-4 py-3 font-bold text-slate-700 outline-none focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100/50" /></label>
        </div>
        <div className="relative mt-5"><Button onClick={() => setGenerated(true)}><Sparkles size={17} /> Sinh nhận xét</Button></div>
      </Card>

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-200/25 blur-[65px]" />
        <div className="relative flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 text-white shadow-lg"><Bot size={21} /></div><div><h3 className="font-black text-slate-950">Nhận xét AI</h3><p className="text-xs font-semibold text-slate-500">Số liệu phải khớp ReportService.</p></div></div>
        {!generated ? <div className="relative grid min-h-[340px] place-items-center text-center"><div><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-violet-600"><Sparkles size={26}/></div><p className="mt-4 text-sm font-bold text-slate-500">Chọn kỳ và bấm “Sinh nhận xét”.</p></div></div> : <div className="relative mt-6 space-y-4"><div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-glow"><div className="flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.14em] text-indigo-100/70">Doanh thu kỳ</div><div className="mt-2 text-3xl font-black">{formatVnd(revenue)}</div></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><TrendingUp size={22}/></div></div></div><div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4 text-sm font-medium leading-7 text-slate-600"><b className="text-indigo-900">Điểm nổi bật:</b> Doanh thu demo đến từ 2 hóa đơn hoàn tất. Sản phẩm có số lượng bán cao nhất trong dữ liệu minh họa là <b>{topProducts[0].name}</b> với <b>{topProducts[0].quantity}</b> sản phẩm.</div><div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 text-sm font-medium leading-7 text-slate-600"><b className="text-emerald-900">Khuyến nghị:</b> tiếp tục theo dõi nhóm sản phẩm bán nhanh và kiểm tra các mặt hàng tồn thấp trước khi lập kế hoạch nhập hàng.</div></div>}
      </Card>
    </div>
  </div>
}
