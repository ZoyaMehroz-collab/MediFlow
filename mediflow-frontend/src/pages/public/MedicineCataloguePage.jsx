import { useState, useEffect, useCallback } from 'react';
import { medicineAPI, categoryAPI } from '../../api';
import MedicineCard from '../../components/common/MedicineCard';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { PageLoader, ErrorMessage } from '../../components/common/UI';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function MedicineCataloguePage() {
  const [medicines,   setMedicines]   = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('');
  const [sortBy,      setSortBy]      = useState('name');
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [page,        setPage]        = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size: 12, sortBy, sortDir: 'asc' };
      if (search)    params.search     = search;
      if (catFilter) params.categoryId = catFilter;
      const res = await medicineAPI.getAll(params);
      setMedicines(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch { setError('Failed to load medicines.'); }
    finally   { setLoading(false); }
  }, [page, search, catFilter, sortBy]);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  // Autocomplete
  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(() => {
      medicineAPI.autocomplete(search).then(r => setSuggestions(r.data.suggestions || [])).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-cyan-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Medicine Catalogue</h1>
          <p className="text-primary-100 text-sm">Browse 30+ pharmaceutical-grade medicines across 8 categories</p>

          {/* Search */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search medicines by name, generic name…"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-slate-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 border-0"
              />
            </div>
            {/* Autocomplete dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 animate-fade-in overflow-hidden">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setSearch(s.name); setSuggestions([]); }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0">
                    <span className="text-base">💊</span>
                    <span><span className="font-medium">{s.name}</span> <span className="text-slate-400">— {s.manufacturer}</span></span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <FiFilter className="text-slate-500" />
          <button onClick={() => { setCatFilter(''); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${!catFilter ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => { setCatFilter(c.id); setPage(0); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${catFilter == c.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}>
              {c.name}
            </button>
          ))}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="ml-auto input-field !w-auto !py-1.5 text-sm">
            <option value="name">Sort: Name</option>
            <option value="unitPrice">Sort: Price</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? <PageLoader /> :
         error   ? <ErrorMessage message={error} onRetry={fetchMedicines} /> : (
          <>
            {medicines.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-600 font-medium">No medicines found</p>
                <p className="text-slate-400 text-sm">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {medicines.map(m => <MedicineCard key={m.id} medicine={m} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-secondary !px-4 !py-2 disabled:opacity-40">← Prev</button>
                <span className="text-sm text-slate-500">Page {page + 1} of {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn-secondary !px-4 !py-2 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
