"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Percent,
  TicketPercent,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface VoucherPageProps {
  onNavigate: (page: string, data?: any) => void;
}

type Voucher = {
  id: string | number;
  title: string;
  code: string;
  discount_type: "percent" | "amount";
  value: number; // ví dụ: 20 (20%) hoặc 50000 (50,000đ)
  min_order?: number | null;
  expiry_date: string; // ISO date string
  status?: "active" | "used" | "expired"; // nếu không có trong DB, sẽ tự tính
  description?: string | null;
};

function formatMoney(v: number) {
  try {
    return v.toLocaleString("vi-VN") + "₫";
  } catch {
    return `${v}₫`;
  }
}

function computeStatus(v: Voucher): "active" | "used" | "expired" {
  if (v.status && v.status !== "active") return v.status;
  const today = new Date();
  const end = new Date(v.expiry_date);
  return end.getTime() < today.setHours(0, 0, 0, 0) ? "expired" : "active";
}

function daysLeft(expiryISO: string) {
  const end = new Date(expiryISO);
  const today = new Date();
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

export default function VoucherPage({ onNavigate }: VoucherPageProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "used" | "expired">(
    "active"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        // Nếu có bảng vouchers trong Supabase, lấy dữ liệu
        const { data, error } = await supabase
          .from("vouchers")
          .select(
            "id, title, code, discount_type, value, min_order, expiry_date, status, description"
          )
          .order("expiry_date", { ascending: true });

        // Fallback demo nếu chưa có bảng dữ liệu
        if (error || !data || data.length === 0) {
          const demo: Voucher[] = [
            {
              id: "v1",
              title: "Freeship cho đơn từ 99k",
              code: "SHIP99",
              discount_type: "amount",
              value: 15000,
              min_order: 99000,
              expiry_date: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 5
              ).toISOString(),
              status: "active",
              description: "Áp dụng cho một số cửa hàng tham gia.",
            },
            {
              id: "v2",
              title: "Giảm 20% đồ ăn nhanh",
              code: "FAST20",
              discount_type: "percent",
              value: 20,
              min_order: 80000,
              expiry_date: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 2
              ).toISOString(),
              status: "active",
              description: "Giảm tối đa 40.000₫.",
            },
            {
              id: "v3",
              title: "Deal 1 đô",
              code: "ONE1",
              discount_type: "amount",
              value: 24000,
              min_order: 50000,
              expiry_date: new Date(
                Date.now() - 1000 * 60 * 60 * 24 * 1
              ).toISOString(),
              status: "expired",
              description: "Số lượng có hạn.",
            },
            {
              id: "v4",
              title: "Giảm 10% Healthy",
              code: "HEALTH10",
              discount_type: "percent",
              value: 10,
              min_order: 70000,
              expiry_date: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 10
              ).toISOString(),
              status: "used",
              description: "Áp dụng vào bữa trưa.",
            },
            {
              id: "v5",
              title: "Freeship mọi đơn",
              code: "SHIPFREE",
              discount_type: "amount",
              value: 20000,
              min_order: 0,
              expiry_date: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 1
              ).toISOString(),
              status: "active",
              description: null,
            },
          ];
          setVouchers(demo);
        } else {
          setVouchers(data as Voucher[]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const grouped = useMemo(() => {
    const byTab = {
      active: [] as Voucher[],
      used: [] as Voucher[],
      expired: [] as Voucher[],
    };
    for (const v of vouchers) {
      const s = computeStatus(v);
      byTab[s].push(v);
    }
    // Sắp xếp: Active theo gần hết hạn trước, Expired theo mới hết hạn trước, Used giữ nguyên
    byTab.active.sort(
      (a, b) => +new Date(a.expiry_date) - +new Date(b.expiry_date)
    );
    byTab.expired.sort(
      (a, b) => +new Date(b.expiry_date) - +new Date(a.expiry_date)
    );
    return byTab;
  }, [vouchers]);

  const list = grouped[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
            onClick={() => onNavigate("home")}
            aria-label="Back"
          >
            <ChevronLeft />
          </button>
          <div className="font-bold text-lg">Your Vouchers</div>
          <div className="ml-auto text-sm text-muted-foreground">
            {vouchers.length} total
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-md mx-auto px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {(["active", "used", "expired"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`py-2 rounded-xl text-sm font-medium border transition ${
                  activeTab === t
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white"
                }`}
              >
                {t === "active" && "Active"}
                {t === "used" && "Used"}
                {t === "expired" && "Expired"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-md mx-auto p-4 pt-2">
        {loading ? (
          <div className="text-sm text-muted-foreground">Đang tải voucher…</div>
        ) : list.length === 0 ? (
          <div className="text-sm text-muted-foreground border rounded-lg p-4">
            Không có voucher trong mục này.
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((v) => {
              const status = computeStatus(v);
              const left = daysLeft(v.expiry_date);
              const isPercent = v.discount_type === "percent";
              const labelValue = isPercent
                ? `${v.value}%`
                : `-${formatMoney(v.value)}`;
              const badge =
                status === "active" ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 size={14} /> Active
                  </span>
                ) : status === "used" ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                    <TicketPercent size={14} /> Used
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                    <XCircle size={14} /> Expired
                  </span>
                );

              return (
                <div
                  key={v.id}
                  className="rounded-2xl overflow-hidden border bg-white"
                >
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Percent />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{v.title}</div>
                      <div className="text-sm opacity-90">
                        {isPercent ? "Discount" : "Instant off"} · {labelValue}
                      </div>
                    </div>
                    {badge}
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Code
                      </span>
                      <code className="px-2 py-1 rounded bg-gray-100 font-semibold">
                        {v.code}
                      </code>
                      <button
                        className="ml-auto text-sm text-cyan-700 hover:underline"
                        onClick={() => navigator.clipboard.writeText(v.code)}
                      >
                        Copy
                      </button>
                    </div>

                    {v.description && (
                      <p className="text-sm text-muted-foreground">
                        {v.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {typeof v.min_order === "number" && v.min_order > 0 && (
                        <span className="px-2 py-1 rounded bg-gray-100">
                          Min order: {formatMoney(v.min_order)}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded bg-gray-100 flex items-center gap-1">
                        <Clock size={14} />
                        Expires:{" "}
                        {new Date(v.expiry_date).toLocaleDateString("vi-VN")}
                      </span>
                      {status === "active" && left >= 0 && (
                        <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">
                          Còn {left} ngày
                        </span>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-end gap-2">
                      <button
                        className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
                        onClick={() => onNavigate("home")}
                      >
                        Back to Home
                      </button>
                      <button
                        disabled={status !== "active"}
                        className={`text-sm px-4 py-2 rounded font-semibold ${
                          status === "active"
                            ? "bg-cyan-600 text-white hover:bg-cyan-700"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          onNavigate("search", {
                            // tuỳ app của bạn xử lý filter/áp mã như thế nào:
                            filters: { voucherCode: v.code },
                            title: `Apply ${v.code}`,
                          })
                        }
                      >
                        Use now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
