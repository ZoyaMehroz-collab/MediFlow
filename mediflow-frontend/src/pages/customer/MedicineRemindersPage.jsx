import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { StatCard } from '../../components/common/UI';
import { FiClock, FiPlus, FiCheckCircle, FiBell, FiTrash2, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MedicineRemindersPage() {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('mediflow_reminders');
    return saved ? JSON.parse(saved) : [
      { id: 1, medicineName: 'Paracetamol 500mg', dosage: '1 Tablet', frequency: 'Twice Daily', time: '08:00 AM & 08:00 PM', active: true },
      { id: 2, medicineName: 'Atorvastatin 20mg',  dosage: '1 Tablet', frequency: 'Once Daily at Night', time: '09:30 PM', active: true },
      { id: 3, medicineName: 'Vitamin D3 60000IU', dosage: '1 Capsule', frequency: 'Weekly (Sundays)', time: '10:00 AM', active: true },
    ];
  });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    medicineName: '',
    dosage: '1 Tablet',
    frequency: 'Twice Daily',
    time: '09:00 AM',
  });

  useEffect(() => {
    localStorage.setItem('mediflow_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleAddReminder = (e) => {
    e.preventDefault();
    const newRem = { id: Date.now(), ...form, active: true };
    setReminders(prev => [newRem, ...prev]);
    setShowModal(false);
    setForm({ medicineName: '', dosage: '1 Tablet', frequency: 'Twice Daily', time: '09:00 AM' });
    toast.success('Dosage reminder scheduled!');
  };

  const toggleActive = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success('Reminder removed');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Smart Dosage & Refill Scheduler</h1>
              <p className="text-sm text-slate-500">Track daily medication times and receive automated refill notifications</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary !text-xs">
              <FiPlus /> Schedule New Dosage
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={<FiClock />} label="Scheduled Reminders" value={reminders.length} color="blue" />
            <StatCard icon={<FiCheckCircle />} label="Active Timers" value={reminders.filter(r => r.active).length} color="green" />
            <StatCard icon={<FiBell />} label="Next Dosage Due" value="08:00 PM" color="yellow" sub="Paracetamol 500mg" />
          </div>

          {/* List of Scheduled Dosages */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Your Active Medication Timelines</h2>

            <div className="grid gap-4">
              {reminders.map(rem => (
                <div key={rem.id} className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition-all ${rem.active ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${rem.active ? 'bg-primary-50 text-primary-600' : 'bg-slate-200 text-slate-400'}`}>
                      💊
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{rem.medicineName}</h3>
                      <p className="text-xs text-slate-500">{rem.dosage} — <span className="font-semibold text-primary-700">{rem.frequency}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Dose Time</span>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                        <FiClock className="text-primary-600" /> {rem.time}
                      </span>
                    </div>

                    <button onClick={() => toggleActive(rem.id)} className={`btn-secondary !text-xs !py-1 !px-3 ${rem.active ? '!border-emerald-500 !text-emerald-700 !bg-emerald-50' : ''}`}>
                      {rem.active ? 'Active' : 'Paused'}
                    </button>

                    <button onClick={() => deleteReminder(rem.id)} className="text-slate-400 hover:text-red-600 p-1">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Schedule Dosage Reminder</h3>
            <form onSubmit={handleAddReminder} className="space-y-3">
              <div>
                <label className="form-label">Medicine Name</label>
                <input required placeholder="e.g. Amoxicillin 500mg" value={form.medicineName} onChange={e => setForm({ ...form, medicineName: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="form-label">Dosage Unit</label>
                  <input required placeholder="e.g. 1 Tablet" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="input-field">
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Three Times Daily">Three Times Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Reminder Time</label>
                <input required placeholder="e.g. 08:00 AM & 08:00 PM" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input-field" />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary !text-xs">Cancel</button>
                <button type="submit" className="btn-primary !text-xs">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
