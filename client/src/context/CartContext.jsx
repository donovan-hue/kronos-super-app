import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'kronos_cart';
const API_URL = process.env.REACT_APP_API_URL || 'https://kronos-api-qq0o.onrender.com/api';

function getToken() {
  return localStorage.getItem('token');
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const syncTimerRef = useRef(null);
  const initialLoadDone = useRef(false);

  // On mount: load cart from server if authenticated, merging with localStorage
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const token = getToken();
    if (!token) return;

    axios
      .get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setCart(data.items);
        }
      })
      .catch(() => {});
  }, []);

  // Debounced sync to server on cart changes
  const syncToServer = useCallback((items) => {
    const token = getToken();
    if (!token) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      axios
        .put(`${API_URL}/cart`, { items }, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => {});
    }, 800);
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    syncToServer(cart);
  }, [cart, syncToServer]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    const token = getToken();
    if (token) {
      axios
        .delete(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => {});
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
