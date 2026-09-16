import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MedicineCard({ medicine }) {
  const cartCtx = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!cartCtx) { 
      toast.error('Please login to add to cart'); 
      return; 
    }
    try {
      await cartCtx.addToCart(medicine.id, 1);
      toast.success(`${medicine.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const totalStock = medicine.totalStock ?? 100;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 20;

  return (
    <Link 
      to={`/medicines/${medicine.id}`} 
      className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-primary-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Decorative subtle gradient background on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100/80">
            {medicine.categoryName || 'General'}
          </span>
          {medicine.prescriptionRequired && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-sm">
              <FiAlertCircle className="w-3 h-3 text-amber-600" /> Rx Required
            </span>
          )}
        </div>

        {/* Dosage form / Strength pill */}
        <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
          <span>{medicine.dosageForm || 'Tablet'}</span>
          <span>•</span>
          <span className="text-slate-500 font-semibold">{medicine.strength || 'Standard'}</span>
        </div>

        {/* Name & Generic */}
        <h3 className="font-bold text-slate-800 text-base leading-snug mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
          {medicine.name}
        </h3>
        <p className="text-xs text-slate-500 mb-2 italic line-clamp-1">
          {medicine.genericName}
        </p>
        <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {medicine.description}
        </p>
      </div>

      {/* Footer: Price & Stock Status & Add Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-slate-400">₹</span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              {medicine.unitPrice?.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                <FiClock className="w-3 h-3" /> Low Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <FiCheckCircle className="w-3 h-3" /> In Stock
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed group/btn"
          title="Add to Cart"
        >
          <FiShoppingCart className="w-4 h-4 group-hover/btn:rotate-6 transition-transform" />
        </button>
      </div>
    </Link>
  );
}
