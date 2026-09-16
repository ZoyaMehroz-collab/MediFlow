import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { orderAPI, prescriptionAPI } from '../../api';
import { StatCard, StatusBadge, PageLoader } from '../../components/common/UI';
import { FiShoppingBag, FiClipboard, FiFileText, FiClock } from 'react-icons/fi';

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, rxRes] = await Promise.all([
          orderAPI.getMyOrders(0, 5),
          prescriptionAPI.getMy(),
        ]);
        setOrders(ordRes.data.content || []);
        setPrescriptions(rxRes.data || []);
      } catch {
        // silent fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Customer Dashboard</h1>
            <p className="text-sm text-slate-500">Track your orders, prescriptions, and account activity</p>
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<FiShoppingBag />} label="Total Orders" value={orders.length} color="blue" />
                <StatCard icon={<FiFileText />} label="Prescriptions" value={prescriptions.length} color="cyan" />
                <StatCard icon={<FiClock />} label="Pending Deliveries" value={orders.filter(o => o.orderStatus !== 'DELIVERED').length} color="yellow" />
              </div>

              {/* Recent Orders */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
                  <Link to="/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All →</Link>
                </div>

                {orders.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4">No recent orders found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(ord => (
                          <tr key={ord.id}>
                            <td className="font-semibold">{ord.orderNumber}</td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                            <td className="font-bold text-primary-700">₹{ord.totalAmount?.toFixed(2)}</td>
                            <td><StatusBadge status={ord.orderStatus} /></td>
                            <td>
                              <Link to={`/orders/${ord.id}`} className="text-xs font-semibold text-primary-600 hover:underline">
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
