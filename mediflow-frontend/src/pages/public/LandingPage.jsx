import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiClock, FiStar, FiPackage } from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const features = [
  { icon: <FiShield className="w-6 h-6" />, color: 'bg-primary-100 text-primary-700', title: 'Verified Medicines', desc: 'Every medicine is sourced from licensed manufacturers and verified by our pharmacists.' },
  { icon: <FiTruck  className="w-6 h-6" />, color: 'bg-cyan-100 text-cyan-700',    title: 'Express Delivery',   desc: 'AI-optimised delivery routing ensures your medicines arrive at lightning speed.' },
  { icon: <FiClock  className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-700', title: '24/7 Pharmacy',   desc: 'Our platform is always open. Order at midnight, have it delivered by morning.' },
  { icon: <FiStar   className="w-6 h-6" />, color: 'bg-amber-100 text-amber-700',  title: 'Smart Inventory',   desc: 'Real-time stock tracking with intelligent expiry management keeps you informed.' },
];

const stats = [
  { value: '10,000+', label: 'Medicines Available' },
  { value: '50,000+', label: 'Happy Customers'     },
  { value: '99.2%',   label: 'On-Time Delivery'    },
  { value: '24/7',    label: 'Pharmacist Support'  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-cyan-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              Smart Healthcare Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Your Health,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary-300">
                Delivered Smart
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              MediFlow combines AI-powered delivery routing, real-time inventory management,
              and secure prescription handling into one seamless platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/medicines" className="btn-primary !text-base !px-8 !py-3 shadow-glow">
                Browse Medicines <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-secondary !text-base !px-8 !py-3 !bg-white/10 !border-white/30 !text-white hover:!bg-white/20">
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Hero visual cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in">
            {[
              { emoji: '💊', title: 'Paracetamol 500mg',  price: '₹12.50', badge: 'In Stock',  color: 'from-primary-600' },
              { emoji: '🩺', title: 'Amoxicillin 500mg',  price: '₹45.50', badge: 'Rx',        color: 'from-cyan-600'    },
              { emoji: '❤️', title: 'Atorvastatin 20mg',  price: '₹65.00', badge: 'In Stock',  color: 'from-emerald-600' },
              { emoji: '🔬', title: 'Metformin 500mg',    price: '₹28.00', badge: 'Rx',        color: 'from-purple-600'  },
            ].map((m, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200">
                <div className={`w-10 h-10 bg-gradient-to-br ${m.color} to-transparent rounded-xl flex items-center justify-center text-xl mb-3`}>{m.emoji}</div>
                <p className="text-white font-semibold text-sm">{m.title}</p>
                <p className="text-cyan-300 font-bold mt-1">{m.price}</p>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full mt-2 inline-block">{m.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-700 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="text-white">
              <p className="text-3xl font-extrabold text-cyan-300">{s.value}</p>
              <p className="text-sm text-primary-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Why Choose MediFlow?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Built with cutting-edge technology to make healthcare management effortless for patients and pharmacies alike.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6 hover:-translate-y-1 transition-all duration-200 hover:shadow-glow">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>{f.icon}</div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-cyan-600 mx-4 rounded-3xl mb-12 max-w-6xl lg:mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">Ready to experience smarter healthcare?</h2>
        <p className="text-primary-100 mb-8 text-lg">Join thousands of customers who trust MediFlow for their pharmacy needs.</p>
        <Link to="/register" className="btn-secondary !px-10 !py-3 !text-base">
          Create Free Account <FiArrowRight />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
