import {
  BarChart3,
  Bell,
  Bot,
  Boxes,
  ClipboardList,
  FileClock,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { roleLabel } from '../utils/format'
import type { Role } from '../types'

type NavItem = {
  label: string
  to: string
  icon: typeof LayoutDashboard
  roles?: Role[]
}

type NavGroup = { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [{ label: 'Bảng điều khiển', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Quản lý',
    items: [
      { label: 'Người dùng', to: '/users', icon: ShieldCheck, roles: ['ADMIN', 'OWNER'] },
      { label: 'Sản phẩm', to: '/products', icon: Boxes },
      { label: 'Khách hàng', to: '/customers', icon: Users },
      { label: 'Hóa đơn', to: '/invoices', icon: ReceiptText },
      { label: 'Lập hóa đơn', to: '/invoices/new', icon: ShoppingCart, roles: ['SALES'] },
      { label: 'Phiếu nhập', to: '/purchase-receipts', icon: ClipboardList },
      { label: 'Lập phiếu nhập', to: '/purchase-receipts/new', icon: PackageSearch, roles: ['ADMIN', 'SALES'] },
      { label: 'Tồn kho', to: '/inventory', icon: PackageSearch },
      { label: 'Báo cáo', to: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Trợ lý AI',
    items: [
      { label: 'Tư vấn sản phẩm', to: '/ai/product-advice', icon: Sparkles },
      { label: 'Nhận xét doanh thu', to: '/ai/revenue-summary', icon: Bot, roles: ['ADMIN', 'OWNER'] },
      { label: 'Hỏi đáp bán hàng', to: '/ai/sales-qa', icon: Bot, roles: ['ADMIN', 'OWNER'] },
    ],
  },
  {
    label: 'Theo dõi',
    items: [
      { label: 'Nhật ký AI', to: '/ai/logs', icon: FileClock, roles: ['ADMIN', 'OWNER'] },
      { label: 'Nhật ký hệ thống', to: '/audit-logs', icon: FileText, roles: ['ADMIN', 'OWNER'] },
    ],
  },
]

function SidebarContent({ close }: { close?: () => void }) {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <div className="app-grid-pattern relative flex h-full flex-col overflow-hidden bg-[#111329] text-white">
      <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-indigo-600/30 blur-[80px]" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-48 w-48 rounded-full bg-cyan-400/10 blur-[75px]" />

      <div className="relative border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-[1.15rem] bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_12px_35px_rgba(99,102,241,.4)]">
            <div className="absolute inset-[1px] rounded-[1.08rem] bg-white/10" />
            <Sparkles className="relative" size={22} />
          </div>
          <div>
            <div className="text-xl font-black tracking-[-0.04em]">Sales<span className="text-cyan-300">AI</span></div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200/65">Smart Sales Workspace</div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const visible = group.items.filter((item) => !item.roles || item.roles.includes(user.role))
          if (!visible.length) return null
          return (
            <div key={group.label} className="mb-5">
              <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.22em] text-indigo-200/45">{group.label}</div>
              <div className="space-y-1">
                {visible.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={close}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-sm font-bold transition duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(124,58,237,.28)]'
                          : 'text-slate-300 hover:bg-white/8 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-cyan-300" />}
                        <span className={`grid h-8 w-8 place-items-center rounded-xl transition ${isActive ? 'bg-white/15' : 'bg-white/5 group-hover:bg-white/10'}`}>
                          <Icon size={17} />
                        </span>
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative border-t border-white/10 p-4">
        <div className="mb-3 rounded-3xl border border-white/10 bg-white/[0.07] p-3.5 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 text-sm font-black shadow-lg">
              {user.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black">{user.fullName}</div>
              <div className="mt-0.5 text-xs font-semibold text-indigo-200/70">{roleLabel(user.role)}</div>
            </div>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.12)]" />
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm font-bold text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
        >
          <LogOut size={17} /> Đăng xuất
        </button>
      </div>
    </div>
  )
}

export function AppShell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="soft-grid-pattern min-h-screen bg-[#f6f7fb]">
      <div className="pointer-events-none fixed left-[28%] top-16 h-72 w-72 rounded-full bg-indigo-300/15 blur-[110px]" />
      <div className="pointer-events-none fixed right-10 top-40 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-[110px]" />
      <div className="pointer-events-none fixed bottom-0 right-[28%] h-80 w-80 rounded-full bg-sky-300/15 blur-[120px]" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Đóng menu" className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[86%] max-w-xs shadow-2xl">
            <button
              aria-label="Đóng menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-xl bg-white/10 p-2 text-white backdrop-blur"
            >
              <X size={18} />
            </button>
            <SidebarContent close={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="relative lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/72 px-4 py-3 shadow-[0_5px_24px_rgba(79,70,229,.05)] backdrop-blur-2xl sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setOpen(true)} className="rounded-xl border border-indigo-100 bg-white p-2.5 text-indigo-700 shadow-sm lg:hidden">
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <div className="truncate text-[11px] font-black uppercase tracking-[0.15em] text-violet-500">Hệ thống quản lý bán hàng tích hợp AI</div>
                <div className="truncate text-sm font-black text-slate-900">Xin chào, {user?.fullName}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-2 text-xs font-black text-emerald-700 sm:flex">
                <Zap size={14} /> Demo đang hoạt động
              </div>
              <button className="relative grid h-10 w-10 place-items-center rounded-2xl border border-indigo-100 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-indigo-600">
                <Bell size={17} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
              <div className="hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-indigo-100 md:block">
                {user ? roleLabel(user.role) : ''}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
