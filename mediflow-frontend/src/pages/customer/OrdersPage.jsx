import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { orderAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await orderAPI.getMyOrders(0, 50);
        setOrders(res.data.content || []);
      } catch {
        // silent handle
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
            <p className="text-sm text-slate-500">View and track all your order history</p>
          </div>

          {loading ? (
            <PageLoader />
          ) : orders.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-semibold text-slate-800">No Orders Placed Yet</h3>
              <p className="text-sm text-slate-500 mb-4">Start browsing medicines to place your first order.</p>
              <Link to="/medicines" className="btn-primary text-xs">Browse Medicines</Link>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => (
                    <tr key={ord.id}>
                      <td className="font-bold text-slate-800">{ord.orderNumber}</td>
                      <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td>{ord.items?.length || 0} items</td>
                      <td className="font-bold text-primary-700">₹{ord.totalAmount?.toFixed(2)}</td>
                      <td><StatusBadge status={ord.orderStatus} /></td>
                      <td>
                        <Link to={`/orders/${ord.id}`} className="text-xs font-semibold text-primary-600 hover:underline">
                          View Details
                        </Link>
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
