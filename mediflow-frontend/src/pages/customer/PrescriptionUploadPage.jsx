import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { prescriptionAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';
import { FiUpload, FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PrescriptionUploadPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionAPI.getMy();
      setPrescriptions(res.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a prescription file (PDF / Image)'); return; }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await prescriptionAPI.upload(formData);
      toast.success('Prescription uploaded successfully!');
      setFile(null);
      fetchPrescriptions();
    } catch {
      toast.error('Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Prescription Upload</h1>
            <p className="text-sm text-slate-500">Upload your prescription for verification by licensed pharmacists</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Box */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Upload New Prescription</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
                  <FiUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium mb-1">Click to select PDF or Image</p>
                  <p className="text-[10px] text-slate-400 mb-3">Max file size: 10MB</p>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => setFile(e.target.files[0])}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>

                {file && (
                  <p className="text-xs text-slate-600 font-semibold truncate">Selected: {file.name}</p>
                )}

                <button type="submit" disabled={uploading || !file} className="btn-primary w-full justify-center !py-2.5">
                  {uploading ? 'Uploading...' : 'Submit Prescription'}
                </button>
              </form>
            </div>

            {/* Prescriptions History */}
            <div className="lg:col-span-2 glass-card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Uploaded Prescriptions</h2>

              {loading ? (
                <PageLoader />
              ) : prescriptions.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">No prescriptions uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Filename</th>
                        <th>Uploaded On</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map(rx => (
                        <tr key={rx.id}>
                          <td className="font-bold">#{rx.id}</td>
                          <td className="font-semibold text-slate-800">{rx.originalFilename}</td>
                          <td>{new Date(rx.uploadedAt).toLocaleDateString()}</td>
                          <td><StatusBadge status={rx.status} /></td>
                          <td className="text-xs text-slate-500">{rx.adminNotes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
