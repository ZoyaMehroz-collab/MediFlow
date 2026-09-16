import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { adminAPI, inventoryAPI } from '../../api';
import { StatCard, StatusBadge, PageLoader } from '../../components/common/UI';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiAlertTriangle, FiClock } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, stockRes, expRes] = await Promise.all([
          adminAPI.getDashboard(),
          inventoryAPI.getLowStock(5),
          inventoryAPI.getExpiringSoon(5),
        ]);
        setSummary(dashRes.data);
        setLowStock(stockRes.data || []);
        setExpiring(expRes.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen flex"><Sidebar /><div className="flex-1 flex flex-col"><Navbar /><PageLoader /></div></div>;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Pharmacy Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Real-time store statistics, revenue analytics, and DSA inventory heaps</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`₹${summary?.totalRevenue?.toFixed(2) || '0.00'}`} color="blue" />
            <StatCard icon={<FiShoppingBag />} label="Total Orders" value={summary?.totalOrders || 0} color="cyan" />
            <StatCard icon={<FiUsers />} label="Registered Customers" value={summary?.totalCustomers || 0} color="green" />
            <StatCard icon={<FiBox />} label="Active Medicines" value={summary?.totalMedicines || 0} color="yellow" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Min-Heap: Low Stock Alert */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FiAlertTriangle className="text-amber-500" /> Low Stock Min-Heap Alert
                </h2>
                <span className="badge badge-yellow">{summary?.lowStockCount || 0} Items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Batch</th>
                      <th>Stock Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-800">{item.medicineName}</td>
                        <td className="text-xs">{item.batchNumber}</td>
                        <td className="font-bold text-red-600">{item.stockQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Min-Heap: Expiring Soon */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FiClock className="text-red-500" /> Expiring Soon Min-Heap
                </h2>
                <span className="badge badge-red">{summary?.expiringCount || 0} Batches</span>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Batch</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiring.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-800">{item.medicineName}</td>
                        <td className="text-xs">{item.batchNumber}</td>
                        <td className="font-bold text-amber-600">{item.expiryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Orders Overview</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.recentOrders?.map(ord => (
                    <tr key={ord.id}>
                      <td className="font-bold">{ord.orderNumber}</td>
                      <td>{ord.customerName}</td>
                      <td className="font-bold text-primary-700">₹{ord.totalAmount?.toFixed(2)}</td>
                      <td><StatusBadge status={ord.orderStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
