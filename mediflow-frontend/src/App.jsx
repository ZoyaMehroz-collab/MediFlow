import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import MedicineCataloguePage from './pages/public/MedicineCataloguePage';
import MedicineDetailPage from './pages/public/MedicineDetailPage';

// Customer Pages
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import PrescriptionUploadPage from './pages/customer/PrescriptionUploadPage';
import MedicineRemindersPage from './pages/customer/MedicineRemindersPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMedicineManagementPage from './pages/admin/AdminMedicineManagementPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminOrderManagementPage from './pages/admin/AdminOrderManagementPage';
import AdminPrescriptionManagementPage from './pages/admin/AdminPrescriptionManagementPage';
import AdminDeliveryManagementPage from './pages/admin/AdminDeliveryManagementPage';

// Delivery Pages
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/medicines" element={<MedicineCataloguePage />} />
            <Route path="/medicines/:id" element={<MedicineDetailPage />} />
            <Route path="/categories" element={<MedicineCataloguePage />} />

            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

            {/* Customer Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><CustomerDashboardPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><PrescriptionUploadPage /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><MedicineRemindersPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_PHARMACY_ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/medicines" element={<ProtectedRoute allowedRoles={['ROLE_PHARMACY_ADMIN']}><AdminMedicineManagementPage /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute allowedRoles={['ROLE_PHARMACY_ADMIN']}><AdminInventoryPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ROLE_PHARMACY_ADMIN']}><AdminOrderManagementPage /></ProtectedRoute>} />
            <Route path="/admin/prescriptions" element={<ProtectedRoute allowedRoles={['ROLE_PHARMACY_ADMIN']}><AdminPrescriptionManagementPage /></ProtectedRoute>} />
            <Route path="/admin/delivery" element={<ProtectedRoute allowedRoles={['ROLE_PHARMACY_ADMIN']}><AdminDeliveryManagementPage /></ProtectedRoute>} />

            {/* Delivery Routes */}
            <Route path="/delivery" element={<ProtectedRoute allowedRoles={['ROLE_DELIVERY_AGENT']}><DeliveryDashboardPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
