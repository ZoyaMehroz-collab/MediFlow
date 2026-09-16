import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { addressAPI, orderAPI, prescriptionAPI } from '../../api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { PageLoader } from '../../components/common/UI';
import { FiMapPin, FiPlus, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // New address form state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    graphNodeId: 6,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [addrRes, rxRes] = await Promise.all([
          addressAPI.getMy(),
          prescriptionAPI.getMy(),
        ]);
        setAddresses(addrRes.data || []);
        if (addrRes.data?.length > 0) {
          const def = addrRes.data.find(a => a.default) || addrRes.data[0];
          setSelectedAddressId(def.id);
        }
        setPrescriptions(rxRes.data?.filter(p => p.status === 'VERIFIED') || []);
      } catch {
        toast.error('Failed to load checkout details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.add(newAddress);
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddressId(res.data.id);
      setShowAddressModal(false);
      toast.success('Address added!');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    setSubmitting(true);
    try {
      const reqData = {
        shippingAddressId: selectedAddressId,
        prescriptionId: selectedPrescriptionId || null,
      };
      const res = await orderAPI.checkout(reqData);
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed to place');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><PageLoader /><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Address Selection */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FiMapPin className="text-primary-600" /> Delivery Address
                </h2>
                <button onClick={() => setShowAddressModal(true)} className="btn-secondary !text-xs !py-1.5">
                  <FiPlus /> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-sm text-slate-400 py-2">No saved addresses. Please add an address to continue.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary-600 bg-primary-50/50 shadow-sm' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm">{addr.recipientName}</span>
                        {selectedAddressId === addr.id && <FiCheckCircle className="text-primary-600" />}
                      </div>
                      <p className="text-xs text-slate-500">{addr.streetAddress}, {addr.city}</p>
                      <p className="text-xs text-slate-500">{addr.state} - {addr.postalCode}</p>
                      <p className="text-xs text-slate-400 mt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescription Selection (Optional / Required) */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Prescription (Optional for OTC)</h2>
              <p className="text-xs text-slate-500 mb-4">If your cart contains prescription medicines, select a verified prescription.</p>

              {prescriptions.length === 0 ? (
                <p className="text-xs text-slate-400">No verified prescriptions available on file.</p>
              ) : (
                <select
                  value={selectedPrescriptionId || ''}
                  onChange={e => setSelectedPrescriptionId(e.target.value ? Number(e.target.value) : null)}
                  className="input-field"
                >
                  <option value="">No prescription attached</option>
                  {prescriptions.map(rx => (
                    <option key={rx.id} value={rx.id}>
                      Prescription #{rx.id} - Uploaded on {new Date(rx.uploadedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

          {/* Checkout Summary */}
          <div>
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Payment Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({cart?.items?.length || 0})</span>
                  <span>₹{cart?.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-base text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-primary-700">₹{cart?.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting || !selectedAddressId}
                className="btn-primary w-full justify-center !py-3 shadow-glow"
              >
                {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input placeholder="Recipient Name" required value={newAddress.recipientName} onChange={e => setNewAddress({ ...newAddress, recipientName: e.target.value })} className="input-field" />
              <input placeholder="Phone Number" required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="input-field" />
              <input placeholder="Street Address" required value={newAddress.streetAddress} onChange={e => setNewAddress({ ...newAddress, streetAddress: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="input-field" />
                <input placeholder="State" required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="input-field" />
              </div>
              <input placeholder="Postal Code" required value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="input-field" />

              <div className="flex gap-2 justify-end pt-3">
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn-secondary !text-xs">Cancel</button>
                <button type="submit" className="btn-primary !text-xs">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
