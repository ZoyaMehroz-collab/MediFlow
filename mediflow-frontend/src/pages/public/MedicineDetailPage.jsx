import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { medicineAPI, reviewAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { PageLoader, ErrorMessage, StatusBadge } from '../../components/common/UI';
import { FiShoppingCart, FiShield, FiPackage, FiStar, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MedicineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartCtx = useCart();
  const { user } = useAuth();

  const [medicine, setMedicine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [medRes, revRes] = await Promise.all([
          medicineAPI.getById(id),
          reviewAPI.getByMedicine(id),
        ]);
        setMedicine(medRes.data);
        setReviews(revRes.data || []);
      } catch {
        setError('Failed to load medicine details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    try {
      await cartCtx.addToCart(medicine.id, quantity);
      toast.success(`${medicine.name} added to cart!`);
    } catch {
      toast.error('Failed to add item to cart');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    setSubmitting(true);
    try {
      const res = await reviewAPI.create(id, { rating, comment });
      setReviews(prev => [res.data, ...prev]);
      setComment('');
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><PageLoader /><Footer /></div>;
  if (error || !medicine) return <div className="min-h-screen flex flex-col"><Navbar /><ErrorMessage message={error || 'Medicine not found'} /><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <Link to="/medicines" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 font-medium">
          <FiArrowLeft /> Back to Catalogue
        </Link>

        {/* Top Details Card */}
        <div className="glass-card p-6 md:p-8 mb-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-gradient-to-br from-primary-50 to-cyan-50 rounded-2xl p-10 flex items-center justify-center border border-primary-100 min-h-[300px]">
            <div className="text-center">
              <span className="text-7xl block mb-4">💊</span>
              <span className="badge badge-blue">{medicine.categoryName || 'General Medicine'}</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {medicine.prescriptionRequired && <span className="badge badge-yellow">Prescription Required</span>}
              <span className={`badge ${medicine.totalStock > 0 ? 'badge-green' : 'badge-red'}`}>
                {medicine.totalStock > 0 ? `${medicine.totalStock} in stock` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{medicine.name}</h1>
            <p className="text-slate-500 text-sm mb-4">Generic: <span className="font-semibold text-slate-700">{medicine.genericName}</span></p>

            <div className="border-y border-slate-100 py-4 my-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Unit Price</span>
                <span className="text-3xl font-extrabold text-primary-700">₹{medicine.unitPrice?.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Manufacturer</span>
                <span className="text-sm font-semibold text-slate-700">{medicine.manufacturer}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">{medicine.description || 'High-quality pharmaceutical formulation tested for purity and efficacy.'}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-l-xl font-bold"
                >-</button>
                <span className="px-4 text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-r-xl font-bold"
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={medicine.totalStock === 0}
                className="btn-primary flex-1 !py-3 justify-center shadow-glow"
              >
                <FiShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiStar className="text-amber-400 fill-amber-400" /> Customer Reviews ({reviews.length})
          </h2>

          {/* Add Review */}
          {user && (
            <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Leave a Review</h3>
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-xl ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                  >★</button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this medicine..."
                className="input-field mb-3 h-20 resize-none"
                required
              />
              <button type="submit" disabled={submitting} className="btn-primary text-xs">
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No reviews yet for this product.</p>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{rev.customerName}</span>
                    <span className="text-xs text-amber-500 font-bold">{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p className="text-sm text-slate-600">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
