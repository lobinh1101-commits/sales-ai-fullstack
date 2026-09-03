import { BarChart3, Download, FileSpreadsheet, FileText, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../components/AuthProvider'
import { Button, Card, PageHeader, StatCard } from '../components/UI'
import { invoices, topProducts } from '../data/demo'
import { formatVnd } from '../utils/format'

const barColors = ['#6366f1', '#8b5cf6', '#d946ef', '#f59e0b']

export function ReportsPage() {
  const { user } = useAuth()
  const revenue = invoices.filter((x) => x.status === 'COMPLETED').reduce((sum, x) => sum + x.total, 0)
  const canExport = user?.role === 'ADMIN' || user?.role === 'OWNER'
  const exportDemo = (format: string) => alert(`Giao diện demo: yêu cầu xuất ${format}. Khi nối backend sẽ gọi /api/v1/reports/export.`)

  return <div>
    <PageHeader eyebrow="Phân tích kinh doanh" title="Báo cáo" description={user?.role === 'SALES' ? 'SALES chỉ xem báo cáo của chính mình và tối đa 31 ngày khi backend áp quyền thật.' : 'Theo dõi doanh thu, sản phẩm bán chạy/bán chậm và xuất báo cáo.'} actions={canExport ? <><Button variant="secondary" onClick={() => exportDemo('PDF')}><FileText size={16} /> PDF</Button><Button variant="secondary" onClick={() => exportDemo('XLSX')}><FileSpreadsheet size={16} /> XLSX</Button><Button onClick={() => exportDemo('CSV')}><Download size={16} /> CSV</Button></> : undefined} />

    <Card className="relative mb-6 overflow-hidden p-4 sm:p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-violet-200/30 blur-[55px]" />
      <div className="relative grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label><span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-indigo-500">Từ ngày</span><input type="date" defaultValue="2026-08-01" className="w-full rounded-2xl border border-indigo-100 bg-gradient-to-r from-white to-indigo-50/50 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100/50" /></label>
        <label><span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-violet-500">Đến ngày (exclusive)</span><input type="date" defaultValue="2026-09-01" className="w-full rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-fuchsia-50/40 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100/50" /></label>
        <div className="self-end"><Button><BarChart3 size={17} /> Xem báo cáo</Button></div>
      </div>
    </Card>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard tone="indigo" label="Doanh thu thuần" value={formatVnd(revenue)} helper="Chỉ hóa đơn COMPLETED" icon={TrendingUp} />
      <StatCard tone="emerald" label="Hóa đơn" value="2" helper="Hoàn tất trong kỳ demo" icon={FileText} />
      <StatCard tone="amber" label="Bán chạy nhất" value="42" helper="Tai nghe A1" icon={TrendingUp} />
      <StatCard tone="rose" label="Bán chậm" value="0" helper="Có tính sản phẩm bán 0" icon={TrendingDown} />
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-fuchsia-200/25 blur-[70px]" />
        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700"><Sparkles size={11} /> Hiệu suất sản phẩm</div>
          <h3 className="text-lg font-black text-slate-950">Top sản phẩm theo số lượng</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">Thứ tự demo theo quantity_sold giảm dần.</p>
          <div className="mt-5 h-[340px] rounded-3xl bg-gradient-to-b from-violet-50/65 to-white/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 10, right: 15 }}>
                <CartesianGrid strokeDasharray="4 6" horizontal={false} stroke="#ddd6fe" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} />
                <YAxis type="category" dataKey="name" width={105} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #ddd6fe', boxShadow: '0 18px 45px rgba(79,70,229,.14)', fontWeight: 700 }} />
                <Bar dataKey="quantity" radius={[0, 10, 10, 0]}>
                  {topProducts.map((entry, index) => <Cell key={entry.name} fill={barColors[index % barColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -left-16 -top-12 h-40 w-40 rounded-full bg-cyan-200/25 blur-[60px]" />
        <div className="relative">
          <div className="mb-2 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-700">Nguồn dữ liệu chính thức</div>
          <h3 className="text-lg font-black text-slate-950">Nguyên tắc số liệu</h3>
          <div className="mt-5 space-y-3 text-sm font-medium leading-6 text-slate-600">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm"><b className="text-emerald-800">Doanh thu:</b> chỉ tính hóa đơn COMPLETED.</div>
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4 shadow-sm"><b className="text-indigo-800">Top/slow:</b> backend xác định từ cùng ReportService.</div>
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm"><b className="text-amber-800">Khoảng ngày:</b> dùng [start, end), không dùng 23:59:59.</div>
            <div className="rounded-2xl border border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 to-pink-50 p-4 shadow-sm"><b className="text-fuchsia-800">Export:</b> PDF/XLSX/CSV lấy từ cùng dữ liệu báo cáo chính thức.</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
}
