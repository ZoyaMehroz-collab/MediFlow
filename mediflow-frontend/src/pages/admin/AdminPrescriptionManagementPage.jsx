import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { prescriptionAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function AdminPrescriptionManagementPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionAPI.getAll();
      setPrescriptions(res.data || []);
    } catch {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const handleVerify = async (id, status) => {
    const adminNotes = window.prompt(`Enter verification notes for status [${status}]:`, status === 'VERIFIED' ? 'Approved prescription' : 'Rejected');
    if (adminNotes === null) return;
    try {
      await prescriptionAPI.verify(id, { status, adminNotes });
      toast.success(`Prescription set to ${status}`);
      fetchPrescriptions();
    } catch {
      toast.error('Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Prescription Verification</h1>
            <p className="text-sm text-slate-500">Review uploaded customer prescriptions and approve Rx orders</p>
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rx ID</th>
                    <th>Customer</th>
                    <th>File</th>
                    <th>Uploaded Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(rx => (
                    <tr key={rx.id}>
                      <td className="font-bold">#{rx.id}</td>
                      <td className="font-semibold text-slate-800">{rx.customerName}</td>
                      <td className="text-xs font-mono text-primary-700">{rx.originalFilename}</td>
                      <td>{new Date(rx.uploadedAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={rx.status} /></td>
                      <td className="text-xs text-slate-500">{rx.adminNotes || '—'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => handleVerify(rx.id, 'VERIFIED')} className="btn-primary !py-1 !px-2.5 !text-[11px] bg-emerald-600 hover:bg-emerald-700">
                            Approve
                          </button>
                          <button onClick={() => handleVerify(rx.id, 'REJECTED')} className="btn-secondary !py-1 !px-2.5 !text-[11px] text-red-600 hover:bg-red-50">
                            Reject
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
    </div>
  );
}
