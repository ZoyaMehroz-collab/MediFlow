export default function Footer() {
  return (
    <footer className="bg-dark-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-md flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="text-lg font-extrabold text-white">Medi<span className="text-cyan-400">Flow</span></span>
          </div>
          <p className="text-sm leading-relaxed">
            Smart Pharmacy & Healthcare Management Platform. Delivering quality medicines with care, speed, and reliability.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs bg-primary-900/50 text-primary-300 px-3 py-1 rounded-full border border-primary-800">
              🔒 Secure & HIPAA-aware
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-cyan-900/40 text-cyan-400 px-3 py-1 rounded-full border border-cyan-800">
              ✓ Licensed Pharmacy
            </span>
          </div>
        </div>
        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/medicines"  className="hover:text-white transition-colors">Browse Medicines</a></li>
            <li><a href="/register"   className="hover:text-white transition-colors">Create Account</a></li>
            <li><a href="/login"      className="hover:text-white transition-colors">Login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 1800-MED-FLOW</li>
            <li>✉ support@mediflow.com</li>
            <li>🏥 24/7 Pharmacist Support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} MediFlow Technologies. B.Tech Portfolio Project.
      </div>
    </footer>
  );
}
