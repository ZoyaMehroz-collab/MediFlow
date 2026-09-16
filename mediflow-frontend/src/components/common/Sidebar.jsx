import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiShoppingBag, FiClipboard, FiLogOut, FiPackage,
  FiUsers, FiBarChart2, FiBox, FiTruck, FiFileText, FiStar,
  FiMapPin, FiList
} from 'react-icons/fi';

const customerLinks = [
  { to: '/dashboard',            icon: <FiHome />,        label: 'Dashboard'     },
  { to: '/medicines',            icon: <FiBox />,         label: 'Browse Medicines' },
  { to: '/cart',                 icon: <FiShoppingBag />, label: 'Cart'          },
  { to: '/orders',               icon: <FiClipboard />,   label: 'My Orders'     },
  { to: '/prescriptions',        icon: <FiFileText />,    label: 'Prescriptions' },
  { to: '/reminders',            icon: <FiList />,        label: 'Refill Reminders'},
  { to: '/my-reviews',           icon: <FiStar />,        label: 'My Reviews'    },
];

const adminLinks = [
  { to: '/admin',                icon: <FiBarChart2 />,   label: 'Dashboard'     },
  { to: '/admin/medicines',      icon: <FiBox />,         label: 'Medicines'     },
  { to: '/admin/categories',     icon: <FiList />,        label: 'Categories'    },
  { to: '/admin/inventory',      icon: <FiPackage />,     label: 'Inventory'     },
  { to: '/admin/orders',         icon: <FiClipboard />,   label: 'Orders'        },
  { to: '/admin/prescriptions',  icon: <FiFileText />,    label: 'Prescriptions' },
  { to: '/admin/customers',      icon: <FiUsers />,       label: 'Customers'     },
  { to: '/admin/delivery',       icon: <FiTruck />,       label: 'Delivery'      },
];

const deliveryLinks = [
  { to: '/delivery',             icon: <FiHome />,        label: 'Dashboard'     },
  { to: '/delivery/orders',      icon: <FiClipboard />,   label: 'My Deliveries' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const links =
    user?.role === 'ROLE_PHARMACY_ADMIN' ? adminLinks :
    user?.role === 'ROLE_DELIVERY_AGENT' ? deliveryLinks : customerLinks;

  const isActive = (to) =>
    to === '/admin' || to === '/delivery' || to === '/dashboard'
      ? location.pathname === to
      : location.pathname.startsWith(to);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm flex-shrink-0">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-lg flex items-center justify-center">
          <FiPackage className="text-white w-4 h-4" />
        </div>
        <span className="text-xl font-extrabold">
          <span className="text-primary-700">Medi</span>
          <span className="text-cyan-600">Flow</span>
        </span>
      </Link>

      {/* User info */}
      <div className="px-4 py-4 mx-3 mt-3 bg-gradient-to-r from-primary-50 to-cyan-50 rounded-xl border border-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.fullName?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-slate-800 text-sm truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 truncate">
              {user?.role?.replace('ROLE_', '').replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-item ${isActive(link.to) ? 'active' : ''}`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut className="text-base" /> Log Out
        </button>
      </div>
    </aside>
  );
}
