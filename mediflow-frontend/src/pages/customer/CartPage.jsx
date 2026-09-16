import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { EmptyState } from '../../components/common/UI';
import { FiTrash2, FiArrowRight, FiShield, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 w-full flex-1">
          <EmptyState
            icon="🛒"
            title="Your Cart is Empty"
            description="Looks like you haven't added any medicines to your cart yet."
            action={
              <Link to="/medicines" className="btn-primary">
                Browse Medicines
              </Link>
            }
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800">Shopping Cart ({cart.items.length})</h1>
          <button onClick={() => clearCart()} className="text-xs text-red-600 hover:underline font-semibold">
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  💊
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{item.medicineName}</h3>
                  <p className="text-xs text-slate-400">Unit Price: ₹{item.unitPrice?.toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  <button
                    onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-bold"
                  >-</button>
                  <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-bold"
                  >+</button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-slate-800 text-sm">₹{item.subtotal?.toFixed(2)}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-600 p-1">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{cart.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-base text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-primary-700">₹{cart.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full justify-center !py-3 shadow-glow">
                Proceed to Checkout <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
