import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="grid min-h-[65vh] place-items-center text-center"><div><div className="text-7xl font-black text-slate-200">404</div><h1 className="mt-3 text-2xl font-black text-slate-950">Không tìm thấy trang</h1><p className="mt-2 text-sm text-slate-500">Đường dẫn này không nằm trong phạm vi giao diện đã định nghĩa.</p><Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><ArrowLeft size={17} /> Về bảng điều khiển</Link></div></div>
}
