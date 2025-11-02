"use client";
import React, { createContext, useContext, useMemo, useReducer } from "react";

export type CartItem = {
  id: string | number;
  name: string;
  price: number; // đơn giá của item sau khi chọn size/topping
  qty: number;
  image?: string;
  meta?: any; // size, toppings, note, ...
};

type State = { items: CartItem[] };
type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; id: CartItem["id"] }
  | { type: "SET_QTY"; id: CartItem["id"]; qty: number }
  | { type: "CLEAR" };

const CartCtx = createContext<{
  state: State;
  addItem: (item: CartItem) => void;
  removeItem: (id: CartItem["id"]) => void;
  setQty: (id: CartItem["id"], qty: number) => void;
  clear: () => void;
  badgeCount: number; // tổng số lượng để hiển thị badge
  totalPrice: number;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM": {
      const idx = state.items.findIndex(
        (it) => String(it.id) === String(action.payload.id)
      );
      if (idx === -1) {
        return { items: [...state.items, action.payload] };
      }
      // nếu đã có -> cộng dồn số lượng
      const items = state.items.slice();
      items[idx] = { ...items[idx], qty: items[idx].qty + action.payload.qty };
      return { items };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((it) => String(it.id) !== String(action.id)),
      };
    case "SET_QTY": {
      const items = state.items.map((it) =>
        String(it.id) === String(action.id) ? { ...it, qty: action.qty } : it
      );
      return { items };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const value = useMemo(() => {
    const badgeCount = state.items.reduce((s, it) => s + it.qty, 0);
    const totalPrice = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    return {
      state,
      badgeCount,
      totalPrice,
      addItem: (item: CartItem) =>
        dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id: CartItem["id"]) => dispatch({ type: "REMOVE_ITEM", id }),
      setQty: (id: CartItem["id"], qty: number) =>
        dispatch({ type: "SET_QTY", id, qty }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider/>");
  return ctx;
}
