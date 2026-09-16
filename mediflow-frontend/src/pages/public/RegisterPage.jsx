import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const user = await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, role: form.role });
      toast.success(`Welcome to MediFlow, ${user.fullName.split(' ')[0]}!`);
      if (user.role === 'ROLE_PHARMACY_ADMIN')  navigate('/admin');
      else if (user.role === 'ROLE_DELIVERY_AGENT') navigate('/delivery');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <FiPackage className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-white">Medi<span className="text-cyan-400">Flow</span></span>
        </Link>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-slate-400 text-sm mb-6">Join MediFlow to manage your healthcare journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" required value={form.fullName} onChange={set('fullName')}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="email" required value={form.email} onChange={set('email')}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="you@email.com" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="tel" value={form.phone} onChange={set('phone')}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="+1-555-0000" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Role</label>
                <select value={form.role} onChange={set('role')}
                  className="input-field !bg-white/10 !border-white/20 !text-white">
                  <option value="CUSTOMER"       className="bg-slate-800">Customer</option>
                  <option value="DELIVERY_AGENT" className="bg-slate-800">Delivery Agent</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="password" required value={form.password} onChange={set('password')}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="Min. 8 characters" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="password" required value={form.confirmPassword} onChange={set('confirmPassword')}
                    className="input-field !bg-white/10 !border-white/20 !text-white !placeholder-slate-500 pl-10"
                    placeholder="Re-enter password" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3 mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
