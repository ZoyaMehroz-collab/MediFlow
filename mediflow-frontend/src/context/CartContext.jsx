import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isCustomer } = useAuth();
  const [cart, setCart]       = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    if (!user || !isCustomer()) return;
    try {
      const res = await cartAPI.getCart();
      setCart(res.data);
      setCartCount(res.data.items?.length || 0);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (medicineId, quantity = 1) => {
    const res = await cartAPI.addItem({ medicineId, quantity });
    setCart(res.data);
    setCartCount(res.data.items?.length || 0);
    return res.data;
  };

  const updateItem = async (itemId, quantity) => {
    const res = await cartAPI.updateItem(itemId, quantity);
    setCart(res.data);
    setCartCount(res.data.items?.length || 0);
  };

  const removeItem = async (itemId) => {
    const res = await cartAPI.removeItem(itemId);
    setCart(res.data);
    setCartCount(res.data.items?.length || 0);
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCart(null);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
