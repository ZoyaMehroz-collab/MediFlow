import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isCustomer } = useAuth();
  const { cartCount } = useCart() || {};
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_PHARMACY_ADMIN')  return '/admin';
    if (user.role === 'ROLE_DELIVERY_AGENT')  return '/delivery';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <FiPackage className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold">
              <span className="text-primary-700">Medi</span>
              <span className="text-cyan-600">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/medicines" className="hover:text-primary-700 transition-colors">Browse Medicines</Link>
            <Link to="/categories" className="hover:text-primary-700 transition-colors">Categories</Link>
            {user && (
              <Link to={getDashboardLink()} className="hover:text-primary-700 transition-colors">Dashboard</Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {user && isCustomer() && (
              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-700 transition-colors">
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-3 pr-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-sm font-medium text-slate-700"
                >
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName?.[0] || 'U'}
                  </div>
                  {user.fullName?.split(' ')[0]}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 text-sm">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <FiUser className="w-4 h-4" /> Dashboard
                    </Link>
                    {isCustomer() && (
                      <Link to="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <FiUser className="w-4 h-4" /> Profile
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <FiLogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-secondary !px-4 !py-2 !text-xs">Login</Link>
                <Link to="/register" className="btn-primary  !px-4 !py-2 !text-xs">Register</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-slide-up">
            <Link to="/medicines"   onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Browse Medicines</Link>
            <Link to="/categories"  onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Categories</Link>
            {user && <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Dashboard</Link>}
          </div>
        )}
      </div>
    </nav>
  );
}
