import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { orderAPI } from '../../api';
import { StatusBadge, PageLoader } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function AdminOrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders(0, 100);
      setOrders(res.data.content || []);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
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
            <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
            <p className="text-sm text-slate-500">Monitor and update customer order fulfillment status</p>
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Current Status</th>
                    <th>Update Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => (
                    <tr key={ord.id}>
                      <td className="font-bold">{ord.orderNumber}</td>
                      <td>{ord.customerName}</td>
                      <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="font-bold text-primary-700">₹{ord.totalAmount?.toFixed(2)}</td>
                      <td><StatusBadge status={ord.orderStatus} /></td>
                      <td>
                        <select
                          value={ord.orderStatus}
                          onChange={e => handleStatusChange(ord.id, e.target.value)}
                          className="input-field !py-1 !text-xs !w-auto"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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
