import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { deliveryAPI, orderAPI, adminAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';
import { FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDeliveryManagementPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [startHub, setStartHub] = useState(1);

  const loadData = async () => {
    try {
      const [delRes, ordRes, agentRes] = await Promise.all([
        deliveryAPI.getAll(),
        orderAPI.getMyOrders(0, 100),
        adminAPI.getAgents(),
      ]);
      setDeliveries(delRes.data || []);
      const unassigned = (ordRes.data.content || []).filter(o => o.orderStatus === 'PLACED' || o.orderStatus === 'VERIFIED' || o.orderStatus === 'PROCESSING');
      setOrders(unassigned);
      setAgents(agentRes.data || []);
      if (unassigned.length > 0) setSelectedOrder(unassigned[0].id);
      if (agentRes.data?.length > 0) setSelectedAgent(agentRes.data[0].id);
    } catch {
      toast.error('Failed to load delivery data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await deliveryAPI.assign({
        orderId: parseInt(selectedOrder),
        deliveryAgentId: parseInt(selectedAgent),
        startHubNodeId: parseInt(startHub),
      });
      toast.success(`Delivery assigned! Dijkstra optimal route computed: ${res.data.optimalRouteNodes}`);
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
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
              <h1 className="text-2xl font-bold text-slate-800">Delivery & Dijkstra Routing</h1>
              <p className="text-sm text-slate-500">Assign orders to delivery agents using Dijkstra shortest-path graph algorithm</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary !text-xs">
              <FiTruck /> Assign New Delivery
            </button>
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Delivery ID</th>
                    <th>Order #</th>
                    <th>Agent</th>
                    <th>Status</th>
                    <th>Optimal Route (Dijkstra)</th>
                    <th>Distance</th>
                    <th>Est. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(del => (
                    <tr key={del.id}>
                      <td className="font-bold">#{del.id}</td>
                      <td className="font-semibold">{del.orderNumber}</td>
                      <td>{del.deliveryAgentName || 'Unassigned'}</td>
                      <td><StatusBadge status={del.status} /></td>
                      <td className="text-xs font-mono text-primary-700 max-w-xs truncate" title={del.optimalRouteNodes}>
                        {del.optimalRouteNodes}
                      </td>
                      <td className="font-bold">{del.totalDistanceKm} km</td>
                      <td>{del.estimatedTimeMins} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Assign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Assign Order Delivery</h3>
            <form onSubmit={handleAssign} className="space-y-3">
              <div>
                <label className="form-label">Select Pending Order</label>
                <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)} className="input-field">
                  {orders.map(o => <option key={o.id} value={o.id}>{o.orderNumber} - ₹{o.totalAmount?.toFixed(2)}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Select Delivery Agent</label>
                <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)} className="input-field">
                  {agents.map(a => <option key={a.id} value={a.id}>{a.fullName} ({a.email})</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Starting Pharmacy Hub</label>
                <select value={startHub} onChange={e => setStartHub(e.target.value)} className="input-field">
                  <option value={1}>Hub 1: Central Pharmacy Hub</option>
                  <option value={2}>Hub 2: North Distribution Junction</option>
                  <option value={3}>Hub 3: East Medical Depot</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary !text-xs">Cancel</button>
                <button type="submit" className="btn-primary !text-xs">Run Dijkstra & Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
