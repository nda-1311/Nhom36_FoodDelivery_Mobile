"use client";

import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCartKey } from "@/app/lib/cartKey";

interface CartPageProps {
  onNavigate: (page: string, data?: any) => void;
}

type CartRow = {
  id: string; // uuid
  cart_key: string;
  product_id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  meta?: any; // {size, toppings, spiciness, note, ...}
  restaurant?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function CartPage({ onNavigate }: CartPageProps) {
  // ================== CART KEY ==================
  const [cartKey, setCartKey] = useState<string>("");
  useEffect(() => {
    (async () => {
      const key = await getCartKey(); // ✅ dùng chung hàm
      setCartKey(key);
    })();
  }, []);

  // ================== STATE ==================
  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);

  // ================== LOAD CART ==================
  useEffect(() => {
    if (!cartKey) return;

    const fetchCart = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_key", cartKey)
        .order("created_at", { ascending: true });

      if (!error && data) setItems(data as CartRow[]);
      setLoading(false);
    };

    fetchCart();

    // Realtime refresh (nếu bạn bật Realtime trên bảng)
    const channel = supabase
      .channel(`cart:${cartKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `cart_key=eq.${cartKey}`,
        },
        () => {
          supabase
            .from("cart_items")
            .select("*")
            .eq("cart_key", cartKey)
            .order("created_at", { ascending: true })
            .then(({ data }) => data && setItems(data as CartRow[]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cartKey]);

  // ================== HELPERS ==================
  const money = (v: number) => `$${v.toFixed(2)}`;
  const totalQty = useMemo(
    () => items.reduce((s, it) => s + (it.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [items]
  );
  const deliveryFee = 2.5;
  const promotion = -3.2;
  const total = subtotal + deliveryFee + promotion;

  const optimisticSet = (id: string, patch: Partial<CartRow>) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );

  // 🔔 Thông báo cho badge cập nhật ngay
  const notifyCartChanged = (detail?: any) => {
    try {
      window.dispatchEvent(new CustomEvent("cart:changed", { detail }));
    } catch {}
  };

  // ================== MUTATIONS ==================
  const updateQuantity = async (id: string, nextQty: number) => {
    if (nextQty <= 0) return removeItem(id);

    // optimistic UI
    optimisticSet(id, { quantity: nextQty });

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: nextQty })
      .eq("id", id);

    if (error) {
      console.error("Update quantity failed:", error);
      // revert về dữ liệu DB để an toàn
      const { data } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_key", cartKey)
        .order("created_at", { ascending: true });
      if (data) setItems(data as CartRow[]);
      return;
    }

    // 🔔 báo badge cập nhật
    notifyCartChanged({ reason: "update" });
  };

  const inc = (id: string) => {
    const cur = items.find((i) => i.id === id)?.quantity || 1;
    updateQuantity(id, cur + 1);
  };

  const dec = (id: string) => {
    const cur = items.find((i) => i.id === id)?.quantity || 1;
    updateQuantity(id, cur - 1);
  };

  const removeItem = async (id: string) => {
    const prev = items;
    setItems((p) => p.filter((i) => i.id !== id));

    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) {
      console.error("Remove failed:", error);
      setItems(prev);
      return;
    }

    // 🔔 báo badge cập nhật
    notifyCartChanged({ reason: "remove" });
  };

  const clearCart = async () => {
    const prev = items;
    setItems([]);

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_key", cartKey);

    if (error) {
      console.error("Clear failed:", error);
      setItems(prev);
      return;
    }

    // 🔔 báo badge cập nhật
    notifyCartChanged({ reason: "clear" });
  };

  // ================== UI ==================
  if (!cartKey || loading) {
    return (
      <div className="animate-slide-in-up pb-20 flex flex-col items-center justify-center min-h-screen">
        <ShoppingBag size={64} className="text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="animate-slide-in-up pb-20 flex flex-col items-center justify-center min-h-screen">
        <ShoppingBag size={64} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Add items to get started
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="gradient-cyan-blue text-white px-6 py-2 rounded-lg font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const restaurantName =
    items.find((i) => i.restaurant)?.restaurant || "Selected Restaurant";

  return (
    <div className="animate-slide-in-up pb-20">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold">Your Cart</h1>
        {/* hiển thị tổng số lượng thay vì số dòng */}
        <p className="text-sm text-white/80">
          {totalQty} item{totalQty > 1 ? "s" : ""}
        </p>
      </div>

      {/* Restaurant Section */}
      <div className="p-4">
        <div className="bg-cyan-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-cyan-900">
            From: {restaurantName}
          </p>
          <p className="text-xs text-cyan-700">Delivery in 20 mins</p>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 pb-4 border-b border-border last:border-b-0"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.meta?.size ? `Size: ${item.meta.size} • ` : ""}
                  {item.meta?.spiciness ?? ""}
                </p>
                {Array.isArray(item.meta?.toppings) &&
                  item.meta.toppings.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {item.meta.toppings.join(", ")}
                    </p>
                  )}

                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">
                    {money((item.price || 0) * (item.quantity || 0))}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dec(item.id)}
                      className="bg-gray-200 p-1 rounded hover:bg-gray-300 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => inc(item.id)}
                      className="bg-gray-200 p-1 rounded hover:bg-gray-300 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 ml-2 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="p-4 border-t border-border">
        <input
          type="text"
          placeholder="Add promo code"
          className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Summary */}
      <div className="p-4 space-y-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{money(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="font-medium">{money(deliveryFee)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-green-600">
          <span>Promotion</span>
          <span className="font-medium">{money(promotion)}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-primary">{money(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate("checkout")}
          className="w-full gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Proceed to Checkout
        </button>
        <button
          onClick={() => onNavigate("home")}
          className="w-full mt-2 border border-border text-foreground py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>

        {/* Optional: Clear toàn bộ giỏ */}
        <button
          onClick={clearCart}
          className="w-full mt-2 text-red-600 text-sm underline"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
