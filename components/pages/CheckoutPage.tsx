"use client";

import { ChevronLeft, MapPin, Clock, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCartKey } from "@/app/lib/cartKey";
import toast from "react-hot-toast";

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void;
}

type CartRow = {
  id: string;
  cart_key: string;
  food_item_id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  meta?: any;
  restaurant?: string | null;
  restaurant_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const [cartKey, setCartKey] = useState<string>("");
  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("ewallet");
  const [selectedAddress, setSelectedAddress] = useState("home");

  // ✅ Load cart key
  useEffect(() => {
    (async () => {
      const key = await getCartKey();
      setCartKey(key);
    })();
  }, []);

  // ✅ Load items từ Supabase
  useEffect(() => {
    if (!cartKey) return;
    const fetchCart = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_key", cartKey)
        .order("created_at", { ascending: true });
      if (!error && data) setItems(data as CartRow[]);
      setLoading(false);
    };
    fetchCart();
  }, [cartKey]);

  const deliveryFee = 2.5;
  const promotion = -3.2;

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [items]
  );
  const total = subtotal + deliveryFee + promotion;
  const money = (v: number) => `$${v.toFixed(2)}`;

  const paymentMethods = [
    {
      id: "ewallet",
      name: "E-wallet",
      icon: "💳",
      description: "Fast and secure",
    },
    {
      id: "card",
      name: "Credit Card",
      icon: "🏦",
      description: "Visa, Mastercard",
    },
    {
      id: "cash",
      name: "Cash on Delivery",
      icon: "💵",
      description: "Pay when delivered",
    },
  ];

  const addresses = [
    { id: "home", label: "Home", address: "201 Katlian No.21 Street" },
    { id: "work", label: "Work", address: "456 Business Ave, Suite 100" },
  ];

  // ✅ Đặt hàng
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert("Giỏ hàng trống, không thể tạo đơn hàng!");
      return;
    }

    // ✅ Lấy restaurant_id từ món đầu tiên trong giỏ hàng
    const firstItem = items[0];
    let restaurantId =
      firstItem?.restaurant_id || firstItem?.meta?.restaurant_id || null;

    if (!restaurantId && typeof firstItem?.restaurant === "string") {
      const { data: rest } = await supabase
        .from("restaurants")
        .select("id")
        .ilike("name", `%${firstItem.restaurant}%`)
        .maybeSingle();
      if (rest?.id) restaurantId = rest.id;
    }

    console.log("restaurantId:", restaurantId);

    if (!restaurantId) {
      alert("Không tìm thấy nhà hàng cho đơn hàng này!");
      return;
    }

    try {
      const { data, error } = await supabase.from("orders").insert([
        {
          user_id: null, // Hoặc thay bằng user_id nếu có login
          restaurant_id: restaurantId, // ✅ Gán đúng giá trị
          status: "Pending",
          delivery_address: selectedAddress,
          delivery_time: 20,
          subtotal,
          delivery_fee: deliveryFee,
          discount: promotion,
          total,
          payment_method: selectedPayment,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("❌ Create order failed:", error);
        alert("Không thể tạo đơn hàng, vui lòng thử lại.");
        return;
      }

      // ✅ Xóa giỏ hàng sau khi đặt
      const { error: delErr } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_key", cartKey);

      if (delErr) console.warn("⚠️ Xóa giỏ hàng thất bại:", delErr);

      toast.success("Đơn hàng đã được tạo thành công 🎉", {
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      onNavigate("order-tracking");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <p>🛒 Giỏ hàng trống.</p>
        <button
          onClick={() => onNavigate("home")}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Quay lại đặt món
        </button>
      </div>
    );
  }

  const restaurantName =
    items.find((i) => i.restaurant)?.restaurant || "Selected Restaurant";

  return (
    <div className="animate-slide-in-up pb-20">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => onNavigate("cart")} className="hover:opacity-80">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Order Review</h1>
      </div>

      {/* Delivery Address */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} className="text-primary" />
          <h3 className="font-bold">Delivery Address</h3>
        </div>
        {addresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => setSelectedAddress(addr.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedAddress === addr.id
                ? "border-primary bg-cyan-50"
                : "border-border hover:border-primary/50"
            }`}
          >
            <p className="font-medium text-sm">{addr.label}</p>
            <p className="text-xs text-muted-foreground">{addr.address}</p>
          </button>
        ))}
      </div>

      {/* Delivery Time */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={20} className="text-primary" />
          <h3 className="font-bold">Delivery Time</h3>
        </div>
        <div className="bg-cyan-50 rounded-lg p-3">
          <p className="text-sm font-medium">Estimated delivery: 20 mins</p>
          <p className="text-xs text-muted-foreground">Arrives by 7:45 PM</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Order Details</h3>
          <button
            onClick={() => onNavigate("cart")}
            className="text-primary text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                {item.meta && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {item.meta?.size ? `Size: ${item.meta.size}` : ""}
                      {item.meta?.spiciness ? ` • ${item.meta.spiciness}` : ""}
                    </p>
                    {Array.isArray(item.meta?.toppings) &&
                      item.meta.toppings.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {item.meta.toppings.join(", ")}
                        </p>
                      )}
                  </>
                )}
              </div>
              <div className="text-right">
                <span className="font-bold text-sm">
                  {money((item.price || 0) * (item.quantity || 0))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={20} className="text-primary" />
          <h3 className="font-bold">Payment Method</h3>
        </div>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedPayment(method.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              selectedPayment === method.id
                ? "border-primary bg-cyan-50"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-xl">{method.icon}</span>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{method.name}</p>
              <p className="text-xs text-muted-foreground">
                {method.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{money(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="font-medium">{money(deliveryFee)}</span>
        </div>
        <div className="flex items-center justify-between text-green-600">
          <span>Promotion</span>
          <span className="font-medium">{money(promotion)}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-primary">{money(total)}</span>
        </div>
      </div>

      {/* Order Button */}
      <div className="p-4">
        <button
          onClick={handlePlaceOrder}
          className="w-full gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
