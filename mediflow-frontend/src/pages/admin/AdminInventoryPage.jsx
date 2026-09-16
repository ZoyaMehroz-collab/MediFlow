import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { inventoryAPI, medicineAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';
import { FiPlus, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    medicineId: '',
    batchNumber: '',
    stockQuantity: 50,
    reorderLevel: 10,
    expiryDate: '',
  });

  const loadData = async () => {
    try {
      const [invRes, medRes] = await Promise.all([
        inventoryAPI.getAll(),
        medicineAPI.getAll({ page: 0, size: 100 }),
      ]);
      setInventory(invRes.data || []);
      setMedicines(medRes.data.content || []);
      if (medRes.data.content?.length > 0) {
        setForm(f => ({ ...f, medicineId: medRes.data.content[0].id }));
      }
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.update({
        medicineId: parseInt(form.medicineId),
        batchNumber: form.batchNumber,
        stockQuantity: parseInt(form.stockQuantity),
        reorderLevel: parseInt(form.reorderLevel),
        expiryDate: form.expiryDate,
      });
      toast.success('Inventory batch updated!');
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update batch');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
              <p className="text-sm text-slate-500">Track batch numbers, stock levels, and expiry dates using DSA Min-Heaps</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary !text-xs">
              <FiPlus /> Add / Update Batch
            </button>
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch #</th>
                    <th>Medicine</th>
                    <th>Stock Qty</th>
                    <th>Reorder Level</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(inv => (
                    <tr key={inv.id}>
                      <td className="font-bold text-slate-800">{inv.batchNumber}</td>
                      <td className="font-semibold">{inv.medicineName}</td>
                      <td className={`font-bold ${inv.stockQuantity <= inv.reorderLevel ? 'text-red-600' : 'text-slate-800'}`}>
                        {inv.stockQuantity}
                      </td>
                      <td>{inv.reorderLevel}</td>
                      <td>{inv.expiryDate}</td>
                      <td><StatusBadge status={inv.status} /></td>
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add or Update Batch Stock</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="form-label">Select Medicine</label>
                <select value={form.medicineId} onChange={e => setForm({ ...form, medicineId: e.target.value })} className="input-field">
                  {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Batch Number</label>
                <input required placeholder="e.g. AMX-2026-009" value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" required value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Reorder Level</label>
                  <input type="number" required value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="form-label">Expiry Date</label>
                <input type="date" required value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="input-field" />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary !text-xs">Cancel</button>
                <button type="submit" className="btn-primary !text-xs">Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
