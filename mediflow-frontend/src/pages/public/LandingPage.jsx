import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiTruck, FiClock, FiStar, 
  FiSearch, FiCheckCircle, FiActivity, FiAward, FiHeart 
} from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const categories = [
  { name: 'Antibiotics', icon: '🛡️', count: '12+ Products' },
  { name: 'Analgesics', icon: '💊', count: '15+ Products' },
  { name: 'Antidiabetics', icon: '💧', count: '8+ Products' },
  { name: 'Cardiovascular', icon: '❤️', count: '10+ Products' },
  { name: 'Vitamins & Supplements', icon: '🌿', count: '20+ Products' },
  { name: 'Antihistamines & Respiratory', icon: '🫁', count: '14+ Products' },
  { name: 'Gastrointestinal', icon: '🧪', count: '9+ Products' },
  { name: 'Dermatology & Skincare', icon: '✨', count: '11+ Products' },
];

const features = [
  { icon: <FiShield className="w-6 h-6 text-primary-600" />, bg: 'bg-primary-50 border-primary-100', title: '100% Certified Medicines', desc: 'Sourced directly from licensed global manufacturers and verified by registered pharmacists.' },
  { icon: <FiTruck className="w-6 h-6 text-cyan-600" />, bg: 'bg-cyan-50 border-cyan-100', title: 'AI Route Optimization', desc: 'Dijkstra algorithm calculates the fastest delivery path directly to your doorstep.' },
  { icon: <FiClock className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100', title: '24/7 Express Dispatch', desc: 'Emergency prescription fulfillment around the clock with live courier tracking.' },
  { icon: <FiAward className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50 border-amber-100', title: 'Refill & Dose Reminders', desc: 'Smart automated schedule alerts so you never miss a daily dose or medicine refill.' },
];

const stats = [
  { value: '30,000+', label: 'Verified Medicines' },
  { value: '99.8%', label: 'On-Time Delivery' },
  { value: '50k+', label: 'Active Users' },
  { value: '24 / 7', label: 'Pharmacist Live Support' },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/medicines');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white">
        {/* Animated Glow Elements */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-cyan-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Smart Pharmacy & Instant Delivery Engine
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                Your Health,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-primary-300">
                  Delivered In Minutes
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                Order authentic prescription drugs, wellness supplements, and daily healthcare supplies with smart AI shortest-path delivery routing.
              </p>

              {/* Hero Search Bar */}
              <form onSubmit={handleSearch} className="max-w-xl flex items-center bg-white p-2 rounded-2xl shadow-2xl border border-white/20">
                <FiSearch className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search medicines, paracetamol, amoxicillin..."
                  className="w-full px-4 py-3 text-slate-800 text-sm outline-none bg-transparent placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="btn-primary !px-6 !py-3 !rounded-xl text-sm font-semibold shrink-0 shadow-lg"
                >
                  Search
                </button>
              </form>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Trending:</span>
                {['Paracetamol', 'Amoxicillin', 'Vitamin D3', 'Omega-3', 'Cetirizine'].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/medicines?search=${tag}`)}
                    className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-lg transition-colors border border-white/10"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Interactive Visual */}
            <div className="lg:col-span-5 relative">
              <div className="bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-lg">
                      💊
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">MediFlow Express Dispatch</h4>
                      <p className="text-xs text-cyan-300">Live Dijkstra Optimization Active</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full">
                    99.8% Speed
                  </span>
                </div>

                {/* Sample visual cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Paracetamol 650mg', cat: 'Analgesics', price: '₹18.00', icon: '💊' },
                    { name: 'Augmentin 625mg', cat: 'Antibiotics', price: '₹135.00', icon: '🛡️' },
                    { name: 'Vitamin D3 60k IU', cat: 'Vitamins', price: '₹85.00', icon: '🌿' },
                    { name: 'Insulin Glargine', cat: 'Diabetes', price: '₹285.00', icon: '💧' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 p-3.5 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                      <span className="text-2xl">{item.icon}</span>
                      <h5 className="text-xs font-semibold text-white mt-2 truncate">{item.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-slate-300">{item.cat}</span>
                        <span className="text-xs font-bold text-cyan-300">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link 
                    to="/medicines" 
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-primary-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-opacity"
                  >
                    Explore 30+ Certified Medicines <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-primary-900 py-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-200">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Medical Catalog</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Browse by Health Needs</h2>
          </div>
          <Link to="/medicines" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 mt-3 md:mt-0">
            View All Categories <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/medicines?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-14 h-14 bg-slate-50 group-hover:bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-colors">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Why MediFlow?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              The Next Generation Digital Pharmacy
            </h2>
            <p className="text-slate-600 mt-3 text-sm">
              Combining modern software engineering with pharmacy operations to ensure safety, speed, and reliability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${feat.bg}`}>
                  {feat.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-cyan-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready to Order Authentic Medicines Online?
            </h2>
            <p className="text-slate-100 text-sm leading-relaxed">
              Create your account in seconds, set up recurring dosage reminders, and get your medicines delivered right to your doorstep.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link to="/register" className="btn-secondary !bg-white !text-primary-700 hover:!bg-slate-100 !px-8 !py-3.5 !rounded-xl !text-base font-bold shadow-lg">
              Create Free Account
            </Link>
            <Link to="/medicines" className="btn-secondary !bg-white/10 !border-white/30 !text-white hover:!bg-white/20 !px-8 !py-3.5 !rounded-xl !text-base font-bold">
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
