import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    if (user.role === 'ROLE_PHARMACY_ADMIN')  return <Navigate to="/admin"    replace />;
    if (user.role === 'ROLE_DELIVERY_AGENT')  return <Navigate to="/delivery" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (!user) return children;
  if (user.role === 'ROLE_PHARMACY_ADMIN')  return <Navigate to="/admin"    replace />;
  if (user.role === 'ROLE_DELIVERY_AGENT')  return <Navigate to="/delivery" replace />;
  return <Navigate to="/dashboard" replace />;
}
