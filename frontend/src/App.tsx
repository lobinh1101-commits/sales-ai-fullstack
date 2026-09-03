import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './layouts/AppShell'
import { AiLogsPage } from './pages/AiLogsPage'
import { AiProductAdvicePage } from './pages/AiProductAdvicePage'
import { AiRevenueSummaryPage } from './pages/AiRevenueSummaryPage'
import { AiSalesQaPage } from './pages/AiSalesQaPage'
import { AuditLogsPage } from './pages/AuditLogsPage'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { InventoryPage } from './pages/InventoryPage'
import { InvoicesPage } from './pages/InvoicesPage'
import { LoginPage } from './pages/LoginPage'
import { NewInvoicePage } from './pages/NewInvoicePage'
import { NewPurchaseReceiptPage } from './pages/NewPurchaseReceiptPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductsPage } from './pages/ProductsPage'
import { PurchaseReceiptsPage } from './pages/PurchaseReceiptsPage'
import { ReportsPage } from './pages/ReportsPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<ProtectedRoute roles={['ADMIN', 'OWNER']}><UsersPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<ProtectedRoute roles={['SALES']}><NewInvoicePage /></ProtectedRoute>} />
        <Route path="/purchase-receipts" element={<PurchaseReceiptsPage />} />
        <Route path="/purchase-receipts/new" element={<ProtectedRoute roles={['ADMIN', 'SALES']}><NewPurchaseReceiptPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ai/product-advice" element={<AiProductAdvicePage />} />
        <Route path="/ai/revenue-summary" element={<ProtectedRoute roles={['ADMIN', 'OWNER']}><AiRevenueSummaryPage /></ProtectedRoute>} />
        <Route path="/ai/sales-qa" element={<ProtectedRoute roles={['ADMIN', 'OWNER']}><AiSalesQaPage /></ProtectedRoute>} />
        <Route path="/ai/logs" element={<ProtectedRoute roles={['ADMIN', 'OWNER']}><AiLogsPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute roles={['ADMIN', 'OWNER']}><AuditLogsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
