"use client";

import { ChevronLeft, Heart } from "lucide-react";
import { useEffect, useState, useMemo } from "react"; // 👈 THÊM
import { supabase } from "@/lib/supabase/client"; // 👈 THÊM

interface FavoritesPageProps {
  onNavigate: (page: string, data?: any) => void;
  favorites: any[];
  onToggleFavorite: (item: any) => void;
}

type FavRow = {
  // 👈 THÊM
  food_item_id: string;
  food_name?: string;
  food_image?: string;
  price?: number;
  created_at?: string;
};

export default function FavoritesPage({
  onNavigate,
  favorites,
  onToggleFavorite,
}: FavoritesPageProps) {
  // ====== BỔ SUNG: đọc từ DB khi refresh ======
  const [userId, setUserId] = useState<string | null>(null);
  const [dbFavs, setDbFavs] = useState<FavRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy user sau khi mount + lắng nghe thay đổi auth
  useEffect(() => {
    let unmounted = false;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!unmounted) setUserId(data.user?.id ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!unmounted) setUserId(session?.user?.id ?? null);
    });

    return () => {
      unmounted = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Khi có userId -> fetch favorites từ Supabase (RLS sẽ tự lọc theo user)
  useEffect(() => {
    const fetchFavs = async () => {
      if (!userId) {
        setDbFavs([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("food_item_id, food_name, food_image, price, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[favorites select]", {
          message: error.message,
          details: (error as any).details,
          code: (error as any).code,
        });
        setDbFavs([]);
      } else {
        setDbFavs(data || []);
      }
      setLoading(false);
    };

    fetchFavs();
  }, [userId]);
  // ============================================

  // Ưu tiên props 'favorites' nếu có; nếu rỗng thì dùng dữ liệu từ DB và map về format cũ (id/name/image/price)
  const list = useMemo(() => {
    if (favorites && favorites.length > 0) return favorites;
    return dbFavs.map((r) => ({
      id: r.food_item_id,
      name: r.food_name,
      image: r.food_image,
      price: r.price,
    }));
  }, [favorites, dbFavs]);

  return (
    <div className="animate-slide-in-up">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 flex items-center gap-3">
        <button onClick={() => onNavigate("home")} className="hover-lift">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Favorites</h1>
      </div>

      {/* Favorites List */}
      <div className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              Loading favorites…
            </p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Heart
              size={48}
              className="text-muted-foreground mb-4 opacity-50"
            />
            <p className="text-muted-foreground text-center">
              No favorites yet
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Add items to your favorites to see them here
            </p>
            <button
              onClick={() => onNavigate("home")}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold text-sm hover-lift"
            >
              Browse Food
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-white border border-border rounded-lg hover:shadow-md transition-all"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {typeof item.price === "number" ? `$${item.price}` : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onNavigate("food-details", item)}
                      className="flex-1 bg-primary text-white py-1 rounded text-xs font-semibold hover-lift"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className="p-1 hover:bg-red-50 rounded transition-all"
                    >
                      <Heart size={18} className="text-red-500 fill-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-8"></div>
    </div>
  );
}
