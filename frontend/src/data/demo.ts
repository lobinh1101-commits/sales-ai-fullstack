import type { Customer, DemoUser, Invoice, Product, Receipt } from '../types'

export const demoUsers: DemoUser[] = [
  { id: 1, fullName: 'Nguyễn Quản Trị', username: 'admin', password: 'Admin@12345', role: 'ADMIN' },
  { id: 2, fullName: 'Trần Nhân Viên', username: 'sales', password: 'Sales@12345', role: 'SALES' },
  { id: 3, fullName: 'Lê Chủ Cửa Hàng', username: 'owner', password: 'Owner@12345', role: 'OWNER' },
]

export const products: Product[] = [
  { id: 1, code: 'SP001', name: 'Tai nghe Bluetooth A1', category: 'Phụ kiện', sellingPrice: 350000, purchasePrice: 245000, stock: 34, active: true },
  { id: 2, code: 'SP002', name: 'Chuột không dây M2', category: 'Phụ kiện', sellingPrice: 290000, purchasePrice: 190000, stock: 18, active: true },
  { id: 3, code: 'SP003', name: 'Bàn phím cơ K68', category: 'Thiết bị', sellingPrice: 890000, purchasePrice: 650000, stock: 9, active: true },
  { id: 4, code: 'SP004', name: 'Webcam Full HD C10', category: 'Thiết bị', sellingPrice: 720000, purchasePrice: 510000, stock: 6, active: true },
  { id: 5, code: 'SP005', name: 'Hub USB-C 6 in 1', category: 'Phụ kiện', sellingPrice: 590000, purchasePrice: 410000, stock: 0, active: true },
  { id: 6, code: 'SP006', name: 'Đế tản nhiệt Laptop', category: 'Phụ kiện', sellingPrice: 420000, purchasePrice: 300000, stock: 14, active: false },
]

export const customers: Customer[] = [
  { id: 1, code: 'KH000001', fullName: 'Nguyễn Văn An', phone: '0901234567', group: 'Thân thiết', totalSpent: 4850000, active: true },
  { id: 2, code: 'KH000002', fullName: 'Trần Minh Anh', phone: '0912345678', group: 'Mới', totalSpent: 1250000, active: true },
  { id: 3, code: 'KH000003', fullName: 'Lê Thu Hà', phone: '0987654321', group: 'VIP', totalSpent: 12890000, active: true },
  { id: 4, code: 'KH000004', fullName: 'Phạm Quốc Bảo', phone: '0934556677', group: 'Thân thiết', totalSpent: 7200000, active: false },
]

export const invoices: Invoice[] = [
  { id: 1, code: 'HD00000081', customer: 'Nguyễn Văn An', creator: 'Trần Nhân Viên', total: 1240000, status: 'COMPLETED', payment: 'BANK_TRANSFER', createdAt: '30/08/2026 20:42' },
  { id: 2, code: 'HD00000080', customer: 'Khách lẻ', creator: 'Trần Nhân Viên', total: 890000, status: 'COMPLETED', payment: 'CASH', createdAt: '30/08/2026 18:05' },
  { id: 3, code: 'HD00000079', customer: 'Lê Thu Hà', creator: 'Trần Nhân Viên', total: 350000, status: 'DRAFT', payment: 'CARD', createdAt: '30/08/2026 16:22' },
  { id: 4, code: 'HD00000078', customer: 'Trần Minh Anh', creator: 'Trần Nhân Viên', total: 720000, status: 'CANCELLED', payment: 'CASH', createdAt: '29/08/2026 11:10' },
]

export const receipts: Receipt[] = [
  { id: 1, code: 'PN00000017', creator: 'Nguyễn Quản Trị', totalQty: 28, status: 'COMPLETED', createdAt: '29/08/2026 09:15' },
  { id: 2, code: 'PN00000018', creator: 'Trần Nhân Viên', totalQty: 12, status: 'DRAFT', createdAt: '30/08/2026 14:35' },
]

export const revenueSeries = [
  { day: '24/08', revenue: 4200000 },
  { day: '25/08', revenue: 5700000 },
  { day: '26/08', revenue: 4900000 },
  { day: '27/08', revenue: 7200000 },
  { day: '28/08', revenue: 6800000 },
  { day: '29/08', revenue: 8100000 },
  { day: '30/08', revenue: 9250000 },
]

export const topProducts = [
  { name: 'Tai nghe A1', quantity: 42, revenue: 14700000 },
  { name: 'Chuột M2', quantity: 35, revenue: 10150000 },
  { name: 'Bàn phím K68', quantity: 19, revenue: 16910000 },
  { name: 'Webcam C10', quantity: 13, revenue: 9360000 },
]

export const auditRows = [
  { id: 1, actor: 'admin', action: 'CANCEL_INVOICE', entity: 'HD00000078', state: 'COMPLETED → CANCELLED', time: '29/08/2026 11:15' },
  { id: 2, actor: 'sales', action: 'CONFIRM_INVOICE', entity: 'HD00000080', state: 'DRAFT → COMPLETED', time: '30/08/2026 18:05' },
  { id: 3, actor: 'admin', action: 'CONFIRM_PURCHASE', entity: 'PN00000017', state: 'DRAFT → COMPLETED', time: '29/08/2026 09:15' },
]

export const aiLogs = [
  { id: 1, type: 'PRODUCT_ADVICE', provider: 'mock', status: 'VALID', fallback: 'Không', latency: '34 ms', time: '30/08/2026 21:10' },
  { id: 2, type: 'REVENUE_SUMMARY', provider: 'mock', status: 'VALID', fallback: 'Không', latency: '41 ms', time: '30/08/2026 20:55' },
  { id: 3, type: 'SALES_QA', provider: 'mock', status: 'FALLBACK', fallback: 'Có', latency: '27 ms', time: '30/08/2026 19:32' },
]
