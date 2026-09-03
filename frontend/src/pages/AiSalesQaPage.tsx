import { Bot, MessageSquareText, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, PageHeader } from '../components/UI'

const samples = ['Tháng này mặt hàng nào bán chậm?', 'Sản phẩm nào bán chạy nhất?', 'Doanh thu kỳ này là bao nhiêu?']

export function AiSalesQaPage() {
  const [question, setQuestion] = useState(samples[0])
  const [asked, setAsked] = useState(false)
  return <div><PageHeader eyebrow="AI hỏi đáp" title="Hỏi đáp dữ liệu bán hàng" description="Chỉ xử lý các intent được cho phép. Không chạy arbitrary text-to-SQL và không vượt quyền dữ liệu của người dùng." actions={<Badge tone="blue">Approved intents only</Badge>} />
    <div className="grid gap-6 xl:grid-cols-[.75fr_1.25fr]">
      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-200/30 blur-[60px]" />
        <div className="relative grid h-14 w-14 place-items-center rounded-[1.3rem] bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-600 text-white shadow-glow"><MessageSquareText size={23} /></div>
        <div className="relative mt-5 inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700">Câu hỏi được duyệt</div>
        <h3 className="relative mt-2 text-xl font-black text-slate-950">Đặt câu hỏi</h3>
        <div className="relative mt-4 space-y-2">{samples.map((s, i) => <button key={s} onClick={() => {setQuestion(s);setAsked(false)}} className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-bold transition hover:-translate-y-0.5 ${i === 0 ? 'border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700' : i === 1 ? 'border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700' : 'border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700'}`}>{s}</button>)}</div>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value.slice(0,1000))} rows={5} className="relative mt-4 w-full rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-indigo-50/45 p-4 text-sm font-semibold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60" />
        <div className="relative mt-4"><Button onClick={() => setAsked(true)}><Send size={17} /> Hỏi AI</Button></div>
      </Card>

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-fuchsia-200/20 blur-[70px]" />
        <div className="relative flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-600 text-white shadow-lg"><Bot size={21} /></div><div><h3 className="font-black text-slate-950">Câu trả lời</h3><p className="text-xs font-semibold text-slate-500">Có evidence từ query/report được duyệt.</p></div></div>
        {!asked ? <div className="relative grid min-h-[350px] place-items-center text-center"><div><div className="mx-auto grid h-18 w-18 h-20 w-20 place-items-center rounded-[2rem] bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 text-violet-600"><Sparkles size={30}/></div><p className="mt-4 text-sm font-bold text-slate-500">Chọn câu hỏi mẫu hoặc nhập câu hỏi của bạn.</p></div></div> : <div className="relative mt-6"><div className="rounded-3xl bg-gradient-to-br from-[#312e81] via-[#6d28d9] to-[#be185d] p-5 text-white shadow-glow"><div className="text-[10px] font-black uppercase tracking-[.15em] text-cyan-200">Câu hỏi</div><div className="mt-2 font-black">{question}</div></div><div className="mt-4 rounded-3xl border border-violet-100 bg-gradient-to-r from-white to-violet-50/50 p-5 text-sm font-medium leading-7 text-slate-600">Trong dữ liệu demo, <b className="text-slate-900">Hub USB-C 6 in 1</b> hiện có tồn bằng 0 và được xem là mặt hàng cần chú ý. Khi hệ thống thật hoạt động, backend sẽ dùng intent được duyệt và ReportService để trả số liệu chính xác theo kỳ.</div><div className="mt-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 text-xs font-bold leading-5 text-emerald-800">Evidence demo: sản phẩm SP005 · current_stock = 0 · dữ liệu giao diện minh họa.</div></div>}
      </Card>
    </div>
  </div>
}
