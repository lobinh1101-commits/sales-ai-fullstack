import { ArrowRight, BarChart3, Boxes, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles, UserRound, Zap } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { demoUsers } from '../data/demo'
import { useAuth } from '../components/AuthProvider'
import { roleLabel } from '../utils/format'

const roleTone = [
  'from-indigo-500 to-violet-600 border-indigo-200 bg-indigo-50/70 text-indigo-800',
  'from-emerald-500 to-teal-600 border-emerald-200 bg-emerald-50/70 text-emerald-800',
  'from-amber-500 to-orange-600 border-amber-200 bg-amber-50/70 text-amber-800',
]

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Admin@12345')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(username, password)) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
      return
    }
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/dashboard', { replace: true })
  }

  const chooseDemo = (index: number) => {
    const account = demoUsers[index]
    setUsername(account.username)
    setPassword(account.password)
    setError('')
  }

  return (
    <div className="app-grid-pattern relative min-h-screen overflow-hidden bg-[#111329] p-3 sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-indigo-600/35 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-100px] top-[20%] h-[460px] w-[460px] rounded-full bg-fuchsia-500/25 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-140px] left-[38%] h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-[120px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1450px] overflow-hidden rounded-[2.4rem] border border-white/12 bg-white shadow-[0_35px_120px_rgba(0,0,0,.45)] lg:grid-cols-[1.08fr_.92fr] sm:min-h-[calc(100vh-2.5rem)]">
        <section className="app-grid-pattern relative hidden overflow-hidden bg-gradient-to-br from-[#171a39] via-[#23205a] to-[#4a1f70] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -right-20 -top-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-pink-500/24 blur-[110px]" />
          <div className="pointer-events-none absolute right-20 top-1/2 h-60 w-60 rounded-full bg-indigo-400/20 blur-[90px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-950/30">
                <Sparkles size={21} />
              </div>
              <div>
                <div className="text-lg font-black tracking-[-0.04em]">Sales<span className="text-cyan-300">AI</span></div>
                <div className="text-[10px] font-bold uppercase tracking-[.22em] text-indigo-100/60">Smart Sales Workspace</div>
              </div>
            </div>

            <div className="mt-16 max-w-2xl xl:mt-20">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.2em] text-cyan-200">
                <Zap size={14} /> Quản lý bán hàng tích hợp AI
              </div>
              <h1 className="text-5xl font-black leading-[1.04] tracking-[-0.045em] xl:text-6xl">
                Một không gian vận hành <span className="bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">hiện đại và trực quan.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base font-medium leading-7 text-indigo-100/75">
                Theo dõi doanh thu, sản phẩm, khách hàng, hóa đơn, nhập hàng, tồn kho và trợ lý AI trong một giao diện nhiều lớp màu nhưng vẫn rõ ràng khi sử dụng.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3">
            {[
              { icon: BarChart3, label: 'Báo cáo', text: 'Doanh thu trực quan', tone: 'from-indigo-400/25 to-violet-400/10', iconTone: 'text-cyan-300' },
              { icon: Boxes, label: 'Tồn kho', text: 'Theo dõi rõ ràng', tone: 'from-emerald-400/20 to-cyan-400/10', iconTone: 'text-emerald-300' },
              { icon: ShieldCheck, label: 'Phân quyền', text: '3 vai trò chuẩn', tone: 'from-pink-400/20 to-orange-400/10', iconTone: 'text-pink-300' },
            ].map(({ icon: Icon, label, text, tone, iconTone }) => (
              <div key={label} className={`rounded-3xl border border-white/12 bg-gradient-to-br ${tone} p-4 backdrop-blur-xl`}>
                <div className="mb-5 flex items-center justify-between">
                  <Icon size={21} className={iconTone} />
                  <CheckCircle2 size={15} className="text-white/35" />
                </div>
                <div className="font-black">{label}</div>
                <div className="mt-1 text-xs font-medium text-indigo-100/60">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="soft-grid-pattern relative flex items-center justify-center bg-gradient-to-br from-white via-[#faf9ff] to-[#eef7ff] p-5 sm:p-9 xl:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-violet-200/35 blur-[70px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full bg-cyan-200/30 blur-[75px]" />

          <div className="relative w-full max-w-lg">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white shadow-glow"><Sparkles size={21} /></div>
                <div><div className="text-lg font-black text-slate-950">SalesAI</div><div className="text-xs font-semibold text-slate-500">Quản lý bán hàng tích hợp AI</div></div>
              </div>
            </div>

            <div className="glass-panel rounded-[2.2rem] border border-white/90 p-6 shadow-[0_28px_80px_rgba(88,74,170,.16)] ring-1 ring-violet-100/70 sm:p-8">
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.2em] text-violet-700">
                  <Sparkles size={12} /> Đăng nhập hệ thống
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950">Chào mừng trở lại</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">Đăng nhập bằng tài khoản demo để xem giao diện theo từng vai trò.</p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Tên đăng nhập</span>
                  <div className="relative">
                    <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-indigo-50/50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/70"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Mật khẩu</span>
                  <div className="relative">
                    <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-indigo-50/50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/70"
                    />
                  </div>
                </label>

                {error && <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div>}

                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3.5 text-sm font-black text-white shadow-[0_14px_35px_rgba(124,58,237,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(124,58,237,.36)]">
                  Đăng nhập <ArrowRight size={18} />
                </button>
              </form>

              <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-200" /><span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tài khoản demo</span><div className="h-px flex-1 bg-gradient-to-r from-violet-200 to-transparent" /></div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {demoUsers.map((account, index) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => chooseDemo(index)}
                    className={`group rounded-2xl border p-3 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${roleTone[index].split(' ').slice(2).join(' ')}`}
                  >
                    <div className={`mb-3 grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${roleTone[index].split(' ').slice(0, 2).join(' ')} text-[10px] font-black text-white shadow-sm`}>
                      {account.role.charAt(0)}
                    </div>
                    <div className="text-xs font-black">{account.role}</div>
                    <div className="mt-1 truncate text-[10px] font-semibold opacity-65">{roleLabel(account.role)}</div>
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-5 text-center text-xs font-medium leading-5 text-slate-400">Dữ liệu hiện tại chỉ dùng để trình diễn giao diện. Dữ liệu chính thức sẽ do backend/PostgreSQL cung cấp.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
