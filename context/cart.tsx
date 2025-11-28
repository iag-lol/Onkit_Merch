"use client";

import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { calcVat, normalizeQuantity } from "@/lib/utils";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextProps {
  items: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totals: { net: number; vat: number; total: number };
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartLine[]>([]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.product.id === product.id);
      const minQty = normalizeQuantity(quantity, 10, product.allowSample);
      if (existing) {
        return prev.map((p) =>
          p.product.id === product.id ? { ...p, quantity: normalizeQuantity(p.quantity + minQty, 10, product.allowSample) } : p
        );
      }
      return [...prev, { product, quantity: minQty }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.product.id === productId
          ? { ...p, quantity: normalizeQuantity(quantity, 10, p.product.allowSample) }
          : p
      )
    );
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((p) => p.product.id !== productId));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const net = items.reduce((acc, line) => acc + line.quantity * line.product.basePrice, 0);
    return calcVat(net);
  }, [items]);

  const value: CartContextProps = { items, addItem, updateQuantity, removeItem, clear, totals };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
