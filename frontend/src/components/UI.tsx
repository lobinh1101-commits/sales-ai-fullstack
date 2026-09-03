import { Search, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div className="max-w-4xl">
        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-violet-700 shadow-sm">
            <Sparkles size={12} /> {eyebrow}
          </div>
        )}
        <h1 className="gradient-text text-3xl font-black tracking-[-0.035em] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-500">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`glass-panel rounded-[1.75rem] border border-white/80 shadow-[0_18px_60px_rgba(76,81,140,0.10)] ring-1 ring-slate-200/55 ${className}`}
    >
      {children}
    </div>
  )
}

type StatTone = 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet'

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'indigo',
}: {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone?: StatTone
}) {
  const tones: Record<StatTone, { bar: string; icon: string; glow: string; label: string }> = {
    indigo: {
      bar: 'from-indigo-500 via-violet-500 to-purple-500',
      icon: 'from-indigo-500 to-violet-600',
      glow: 'bg-indigo-400/20',
      label: 'text-indigo-700',
    },
    emerald: {
      bar: 'from-emerald-400 via-teal-500 to-cyan-500',
      icon: 'from-emerald-500 to-teal-600',
      glow: 'bg-emerald-400/20',
      label: 'text-emerald-700',
    },
    amber: {
      bar: 'from-amber-400 via-orange-500 to-rose-500',
      icon: 'from-amber-500 to-orange-600',
      glow: 'bg-orange-400/20',
      label: 'text-orange-700',
    },
    rose: {
      bar: 'from-rose-400 via-pink-500 to-fuchsia-500',
      icon: 'from-rose-500 to-pink-600',
      glow: 'bg-pink-400/20',
      label: 'text-rose-700',
    },
    sky: {
      bar: 'from-sky-400 via-blue-500 to-indigo-500',
      icon: 'from-sky-500 to-blue-600',
      glow: 'bg-sky-400/20',
      label: 'text-sky-700',
    },
    violet: {
      bar: 'from-violet-400 via-purple-500 to-fuchsia-500',
      icon: 'from-violet-500 to-fuchsia-600',
      glow: 'bg-violet-400/20',
      label: 'text-violet-700',
    },
  }
  const style = tones[tone]
  return (
    <Card className="group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(76,81,140,0.16)]">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.bar}`} />
      <div className={`absolute -right-7 -top-7 h-24 w-24 rounded-full blur-2xl ${style.glow}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.12em] ${style.label}`}>{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${style.icon} text-white shadow-lg transition duration-300 group-hover:scale-105 group-hover:rotate-3`}>
          <Icon size={21} />
        </div>
      </div>
      <div className="relative mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${style.bar}`} />
        {helper}
      </div>
    </Card>
  )
}

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'green' | 'amber' | 'red' | 'blue' | 'slate' | 'violet' }) {
  const tones = {
    green: 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700',
    amber: 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700',
    red: 'border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700',
    blue: 'border-sky-200 bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700',
    slate: 'border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600',
    violet: 'border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700',
  }
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black shadow-sm ${tones[tone]}`}>{children}</span>
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_10px_28px_rgba(124,58,237,.25)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(124,58,237,.34)]',
    secondary: 'border border-white/80 bg-white/85 text-slate-700 shadow-sm ring-1 ring-slate-200/70 hover:-translate-y-0.5 hover:bg-white hover:text-indigo-700',
    danger: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_10px_24px_rgba(244,63,94,.22)] hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-600 hover:bg-indigo-50 hover:text-indigo-700',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Tìm kiếm...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-indigo-50/45 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/60"
      />
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-16 text-center">
      <div className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow">
        <div className="absolute -inset-3 rounded-[2rem] bg-violet-300/20 blur-xl" />
        <Sparkles className="relative" size={25} />
      </div>
      <p className="font-black text-slate-800">{title}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
    </div>
  )
}
