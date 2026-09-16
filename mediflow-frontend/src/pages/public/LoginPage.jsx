import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname;

  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const redirectAfterLogin = (role) => {
    if (from && from !== '/login' && from !== '/register') { navigate(from, { replace: true }); return; }
    if (role === 'ROLE_PHARMACY_ADMIN')  navigate('/admin',    { replace: true });
    else if (role === 'ROLE_DELIVERY_AGENT') navigate('/delivery', { replace: true });
    else navigate('/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      redirectAfterLogin(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email) => {
    setForm({ email, password: 'Password123!' });
    setLoading(true);
    try {
      const user = await login(email, 'Password123!');
      toast.success(`Demo login: ${user.fullName}`);
      redirectAfterLogin(user.role);
    } catch { toast.error('Demo login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FiPackage className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">Medi<span className="text-cyan-400">Flow</span></span>
          </Link>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Smart pharmacy<br />management platform
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Secure prescriptions, real-time inventory, and AI-powered delivery routing — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {['10,000+ Medicines', '50k+ Customers', 'Real-time Tracking', 'Secure Platform'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FiPackage className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-white">Medi<span className="text-cyan-400">Flow</span></span>
          </Link>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm mb-6">Sign in to your MediFlow account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="password" required value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Demo logins */}
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-xs text-slate-500 mb-3 text-center">Demo accounts (password: Password123!)</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Customer',  email: 'john.doe@email.com'   },
                  { label: 'Admin',     email: 'admin@mediflow.com'   },
                  { label: 'Delivery',  email: 'agent1@mediflow.com'  },
                ].map(d => (
                  <button key={d.email} onClick={() => demoLogin(d.email)}
                    className="text-[11px] bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg border border-white/20 transition-colors">
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-slate-400 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
