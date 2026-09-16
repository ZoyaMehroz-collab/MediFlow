import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { deliveryAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';
import { FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeliveryDashboardPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const res = await deliveryAPI.getMy();
      setDeliveries(res.data || []);
    } catch {
      toast.error('Failed to load assigned deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await deliveryAPI.updateStatus(id, status);
      toast.success(`Delivery status updated to ${status}`);
      fetchDeliveries();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Delivery Agent Portal</h1>
            <p className="text-sm text-slate-500">View assigned delivery routes and update delivery status</p>
          </div>

          {loading ? (
            <PageLoader />
          ) : deliveries.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-semibold text-slate-800">No Assigned Deliveries</h3>
              <p className="text-sm text-slate-500">You currently have no active deliveries assigned.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {deliveries.map(del => (
                <div key={del.id} className="glass-card p-6 border-l-4 border-l-primary-600">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">Order #{del.orderNumber}</h3>
                      <p className="text-xs text-slate-400">Assigned: {new Date(del.assignedAt).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={del.status} />
                  </div>

                  {/* Route Map Card */}
                  <div className="bg-slate-900 text-white rounded-xl p-4 mb-4 text-xs">
                    <p className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                      <FiMapPin /> Optimal Route (Dijkstra Algorithm):
                    </p>
                    <p className="font-mono text-slate-200">{del.optimalRouteNodes}</p>
                    <div className="mt-2 flex gap-4 text-slate-400 border-t border-slate-800 pt-2">
                      <span>Distance: <strong className="text-white">{del.totalDistanceKm} km</strong></span>
                      <span>Est. Time: <strong className="text-white">{del.estimatedTimeMins} mins</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {del.status === 'ASSIGNED' && (
                      <button onClick={() => handleUpdateStatus(del.id, 'PICKED_UP')} className="btn-primary !text-xs">
                        Mark as Picked Up
                      </button>
                    )}
                    {(del.status === 'PICKED_UP' || del.status === 'IN_TRANSIT') && (
                      <button onClick={() => handleUpdateStatus(del.id, 'DELIVERED')} className="btn-primary !text-xs bg-emerald-600 hover:bg-emerald-700">
                        <FiCheckCircle /> Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
