import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { orderAPI, deliveryAPI } from '../../api';
import { StatusBadge, PageLoader, ErrorMessage } from '../../components/common/UI';
import DeliveryMapVisualizer from '../../components/common/DeliveryMapVisualizer';
import { FiArrowLeft, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await orderAPI.getById(id);
        setOrder(res.data);
        // fetch delivery status if out for delivery or delivered
        try {
          const delRes = await deliveryAPI.getById(id);
          setDelivery(delRes.data);
        } catch {
          // silent
        }
      } catch {
        setError('Order not found or access denied.');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex"><Sidebar /><div className="flex-1 flex flex-col"><Navbar /><PageLoader /></div></div>;
  if (error || !order) return <div className="min-h-screen flex"><Sidebar /><div className="flex-1 flex flex-col"><Navbar /><ErrorMessage message={error} /></div></div>;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-medium">
            <FiArrowLeft /> Back to Orders
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">Order {order.orderNumber}</h1>
              <p className="text-xs text-slate-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <StatusBadge status={order.orderStatus} />
          </div>

          {/* Delivery Tracker / Optimal Route */}
          {delivery && (
            <DeliveryMapVisualizer
              routeNodesString={delivery.optimalRouteNodes}
              distanceKm={delivery.totalDistanceKm}
              timeMins={delivery.estimatedTimeMins}
            />
          )}

          {/* Items Table */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map(item => (
                    <tr key={item.id}>
                      <td className="font-semibold text-slate-800">{item.medicineName}</td>
                      <td>₹{item.unitPrice?.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="font-bold text-slate-900">₹{item.subtotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Amount Paid</span>
                <span className="text-2xl font-extrabold text-primary-700">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
