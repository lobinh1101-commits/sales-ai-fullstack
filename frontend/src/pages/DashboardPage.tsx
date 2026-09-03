import { ArrowUpRight, Banknote, Boxes, PackageCheck, ReceiptText, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, PageHeader, StatCard } from '../components/UI'
import { invoices, products, revenueSeries, topProducts } from '../data/demo'
import { formatVnd } from '../utils/format'

const rankStyles = [
  'from-amber-400 to-orange-500 shadow-orange-100',
  'from-slate-300 to-slate-500 shadow-slate-100',
  'from-orange-300 to-amber-600 shadow-amber-100',
  'from-indigo-400 to-violet-500 shadow-indigo-100',
]

export function DashboardPage() {
  const completed = invoices.filter((item) => item.status === 'COMPLETED')
  const todayRevenue = completed.reduce((sum, item) => sum + item.total, 0)
  const activeProducts = products.filter((item) => item.active).length
  const totalStock = products.reduce((sum, item) => sum + item.stock, 0)

  return (
    <div>
      <PageHeader
        eyebrow="Tổng quan cửa hàng"
        title="Bảng điều khiển"
        description="Theo dõi nhanh tình hình bán hàng, tồn kho và xu hướng doanh thu. Các số liệu ở bản này là dữ liệu giao diện demo."
      />

      <div className="relative mb-6 overflow-hidden rounded-[2.15rem] bg-gradient-to-br from-[#4338ca] via-[#7c3aed] to-[#db2777] p-[1px] shadow-[0_26px_70px_rgba(124,58,237,.25)]">
        <div className="app-grid-pattern relative overflow-hidden rounded-[2.1rem] bg-gradient-to-br from-[#312e81]/95 via-[#6d28d9]/95 to-[#be185d]/95 px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute -right-14 -top-24 h-72 w-72 rounded-full bg-cyan-300/25 blur-[90px]" />
          <div className="absolute -bottom-24 left-[28%] h-72 w-72 rounded-full bg-fuchsia-300/20 blur-[95px]" />
          <div className="absolute bottom-[-70px] right-[20%] h-48 w-48 rounded-full bg-amber-300/20 blur-[75px]" />

          <div className="relative z-10 grid gap-8 xl:grid-cols-[1.3fr_.7fr] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black text-cyan-100 backdrop-blur">
                <Zap size={14} /> Tổng quan hôm nay
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-[2.7rem] lg:leading-[1.08]">
                Vận hành bán hàng <span className="text-cyan-200">nhanh hơn</span>, theo dõi số liệu <span className="text-amber-200">trực quan hơn.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-indigo-100/75">Dashboard minh họa số liệu tổng hợp; giá, tồn và doanh thu chính thức vẫn do backend xử lý khi hệ thống hoàn chỉnh.</p>
            </div>

            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-100/60">Doanh thu demo hôm nay</div>
                  <div className="mt-2 text-3xl font-black tracking-tight">{formatVnd(todayRevenue)}</div>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-900 shadow-lg">
                  <TrendingUp size={22} />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2.5">
                <span className="text-xs font-bold text-indigo-100/70">So với kỳ minh họa</span>
                <span className="flex items-center gap-1 text-xs font-black text-emerald-200"><TrendingUp size={14} /> +12,6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="indigo" label="Doanh thu" value={formatVnd(todayRevenue)} helper="Chỉ tính hóa đơn COMPLETED" icon={Banknote} />
        <StatCard tone="emerald" label="Hóa đơn hoàn tất" value={`${completed.length}`} helper="Trong dữ liệu demo hiện tại" icon={ReceiptText} />
        <StatCard tone="amber" label="Sản phẩm đang bán" value={`${activeProducts}`} helper="Sản phẩm active" icon={Boxes} />
        <StatCard tone="sky" label="Tổng tồn hiện có" value={`${totalStock}`} helper="Tồn kho chỉ đọc trên UI" icon={PackageCheck} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_.85fr]">
        <Card className="relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-16 h-44 w-44 rounded-full bg-indigo-200/30 blur-[60px]" />
          <div className="relative mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600"><Sparkles size={11} /> Phân tích xu hướng</div>
              <h3 className="text-lg font-black text-slate-950">Xu hướng doanh thu 7 ngày</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">Biểu đồ minh họa doanh thu theo ngày.</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-2 text-xs font-black text-indigo-700">Asia/Ho_Chi_Minh</div>
          </div>
          <div className="relative h-[330px] w-full rounded-3xl bg-gradient-to-b from-indigo-50/70 to-white/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: 0, right: 10, top: 15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.46} />
                    <stop offset="55%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="linePremium" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="55%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#db2777" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#ddd6fe" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} tickFormatter={(v) => `${Math.round(v / 1000000)}tr`} />
                <Tooltip formatter={(v) => formatVnd(Number(v))} contentStyle={{ borderRadius: 18, border: '1px solid #ddd6fe', boxShadow: '0 18px 45px rgba(79,70,229,.14)', fontWeight: 700 }} />
                <Area type="monotone" dataKey="revenue" stroke="url(#linePremium)" strokeWidth={4} fill="url(#revPremium)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-200/30 blur-[55px]" />
          <div className="relative mb-5 flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">Top bán chạy</div>
              <h3 className="text-lg font-black text-slate-950">Sản phẩm nổi bật</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">Theo số lượng bán.</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-100"><ArrowUpRight size={19} /></div>
          </div>
          <div className="relative space-y-3">
            {topProducts.map((item, index) => (
              <div key={item.name} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/70 p-4 transition hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${rankStyles[index]} text-sm font-black text-white shadow-lg`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-slate-900">{item.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{item.quantity} sản phẩm đã bán</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: `${Math.max(18, (item.quantity / topProducts[0].quantity) * 100)}%` }} />
                  </div>
                </div>
                <div className="text-right text-xs font-black text-violet-700">{formatVnd(item.revenue)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
