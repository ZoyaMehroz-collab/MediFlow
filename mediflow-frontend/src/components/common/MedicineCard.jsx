import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MedicineCard({ medicine }) {
  const cartCtx = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!cartCtx) { toast.error('Please login to add to cart'); return; }
    try {
      await cartCtx.addToCart(medicine.id, 1);
      toast.success(`${medicine.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const stockStatus = medicine.totalStock > 20 ? 'In Stock'
    : medicine.totalStock > 0 ? 'Low Stock' : 'Out of Stock';
  const stockClass = medicine.totalStock > 20 ? 'badge-green'
    : medicine.totalStock > 0 ? 'badge-yellow' : 'badge-red';

  return (
    <Link to={`/medicines/${medicine.id}`} className="medicine-card block group">
      {/* Category & Prescription badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="badge badge-blue">{medicine.categoryName || 'General'}</span>
        {medicine.prescriptionRequired && (
          <span className="badge badge-yellow">Rx</span>
        )}
      </div>

      {/* Medicine info */}
      <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1 group-hover:text-primary-700 transition-colors line-clamp-2">
        {medicine.name}
      </h3>
      <p className="text-xs text-slate-500 mb-1">{medicine.genericName}</p>
      <p className="text-xs text-slate-400 mb-3">{medicine.manufacturer}</p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-primary-700">₹{medicine.unitPrice?.toFixed(2)}</p>
          <span className={`text-[10px] ${stockClass}`}>{stockStatus}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={medicine.totalStock === 0}
          className="w-9 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FiShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}
