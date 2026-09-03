export const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)

export const roleLabel = (role: string) => {
  if (role === 'ADMIN') return 'Quản trị viên'
  if (role === 'SALES') return 'Nhân viên bán hàng'
  return 'Chủ cửa hàng'
}
