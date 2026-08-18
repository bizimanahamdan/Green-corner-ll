import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { parsePrice } from "./business";

const CartContext = createContext(null);
const STORAGE_KEY = "green-corner-order-cart";

function loadCart() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item, { reveal = true } = {}) => {
    setItems((prev) => {
      const existing = prev.find((row) => row.id === item.id);
      if (existing) {
        return prev.map((row) => (row.id === item.id ? { ...row, qty: row.qty + 1 } : row));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
    if (reveal) setOpen(true);
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((row) => row.id !== id);
      return prev.map((row) => (row.id === id ? { ...row, qty } : row));
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const count = useMemo(() => items.reduce((sum, row) => sum + row.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, row) => sum + (parsePrice(row.price) || 0) * row.qty, 0),
    [items]
  );

  const value = {
    items,
    count,
    total,
    open,
    addItem,
    setQty,
    removeItem,
    clear,
    openCart,
    closeCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
