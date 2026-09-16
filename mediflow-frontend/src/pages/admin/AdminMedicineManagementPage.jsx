import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { medicineAPI, categoryAPI } from '../../api';
import { PageLoader, StatusBadge } from '../../components/common/UI';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminMedicineManagementPage() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    genericName: '',
    categoryId: '',
    manufacturer: '',
    dosageForm: 'Tablet',
    strength: '',
    unitPrice: '',
    prescriptionRequired: false,
    description: '',
  });

  const loadData = async () => {
    try {
      const [medRes, catRes] = await Promise.all([
        medicineAPI.getAll({ page: 0, size: 100 }),
        categoryAPI.getAll(),
      ]);
      setMedicines(medRes.data.content || []);
      setCategories(catRes.data || []);
      if (catRes.data?.length > 0) setForm(f => ({ ...f, categoryId: catRes.data[0].id }));
    } catch {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      genericName: '',
      categoryId: categories[0]?.id || '',
      manufacturer: '',
      dosageForm: 'Tablet',
      strength: '',
      unitPrice: '',
      prescriptionRequired: false,
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (med) => {
    setEditingId(med.id);
    setForm({
      name: med.name,
      genericName: med.genericName || '',
      categoryId: med.categoryId,
      manufacturer: med.manufacturer || '',
      dosageForm: med.dosageForm || 'Tablet',
      strength: med.strength || '',
      unitPrice: med.unitPrice,
      prescriptionRequired: med.prescriptionRequired,
      description: med.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        unitPrice: parseFloat(form.unitPrice),
        categoryId: parseInt(form.categoryId),
      };
      if (editingId) {
        await medicineAPI.update(editingId, payload);
        toast.success('Medicine updated successfully!');
      } else {
        await medicineAPI.create(payload);
        toast.success('Medicine created successfully!');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this medicine?')) return;
    try {
      await medicineAPI.delete(id);
      toast.success('Medicine deactivated');
      loadData();
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.genericName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Medicine Management</h1>
              <p className="text-sm text-slate-500">Create, update, and manage catalogue medicines</p>
            </div>
            <button onClick={handleOpenAdd} className="btn-primary !text-xs">
              <FiPlus /> Add Medicine
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Manufacturer</th>
                    <th>Price</th>
                    <th>Rx Required</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map(med => (
                    <tr key={med.id}>
                      <td className="font-bold">#{med.id}</td>
                      <td>
                        <span className="font-semibold text-slate-800 block">{med.name}</span>
                        <span className="text-xs text-slate-400">{med.genericName}</span>
                      </td>
                      <td><span className="badge badge-blue">{med.categoryName}</span></td>
                      <td className="text-xs">{med.manufacturer}</td>
                      <td className="font-bold text-primary-700">₹{med.unitPrice?.toFixed(2)}</td>
                      <td>{med.prescriptionRequired ? <span className="badge badge-yellow">Yes</span> : <span className="badge badge-gray">No</span>}</td>
                      <td className="font-bold">{med.totalStock}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenEdit(med)} className="p-1.5 text-slate-600 hover:text-primary-600">
                            <FiEdit />
                          </button>
                          <button onClick={() => handleDelete(med.id)} className="p-1.5 text-slate-600 hover:text-red-600">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="form-label">Medicine Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Paracetamol 500mg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="form-label">Generic Name</label>
                  <input value={form.genericName} onChange={e => setForm({ ...form, genericName: e.target.value })} className="input-field" placeholder="e.g. Paracetamol" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="input-field">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="form-label">Manufacturer</label>
                  <input value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} className="input-field" placeholder="e.g. GenMed" />
                </div>
                <div>
                  <label className="form-label">Unit Price (₹)</label>
                  <input type="number" step="0.01" required value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} className="input-field" placeholder="12.50" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="rxReq" checked={form.prescriptionRequired} onChange={e => setForm({ ...form, prescriptionRequired: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor="rxReq" className="text-sm font-medium text-slate-700">Prescription Required (Rx)</label>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary !text-xs">Cancel</button>
                <button type="submit" className="btn-primary !text-xs">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
