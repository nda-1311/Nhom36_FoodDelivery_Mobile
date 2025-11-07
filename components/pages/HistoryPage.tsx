"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function HistoryPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        Đang tải lịch sử đơn hàng...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <p>🕒 Chưa có đơn hàng nào.</p>
        <button
          onClick={() => onNavigate("home")}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Đặt món ngay
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("home")}>
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">📜 Lịch sử đơn hàng</h2>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <h3 className="font-medium">Mã đơn: {order.order_number}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Trạng thái:{" "}
                <span
                  className={`font-medium ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <DollarSign size={16} />
              <span className="font-semibold">
                {order.total_amount.toLocaleString()}₫
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
