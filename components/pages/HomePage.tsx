"use client";

import { supabase } from "@/lib/supabase/client";
import { Search, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
  favorites: any[];
  onToggleFavorite: (item: any) => void;
}

type FoodItem = {
  id: string | number;
  name: string;
  image_url: string | null;
  price: number | null;
  rating: number | null;
  category: string | null;
  collection: string | null;
};

type Restaurant = {
  id: string | number;
  name: string;
  cuisine: string | null;
  time_minutes: number | null;
  rating: number | null;
  image_url: string | null;
  tags: string[] | null;
};

const ICON_BY_CATEGORY: Record<string, string> = {
  rice: "🍚",
  healthy: "🥗",
  drink: "🥤",
  fastfood: "🍔",
};

const LABEL_BY_COLLECTION: Record<
  string,
  { name: string; color: string; icon: string }
> = {
  freeship: {
    name: "FREESHIP",
    color: "from-green-100 to-emerald-100",
    icon: "🍱",
  },
  "deal-1": {
    name: "DEAL $1",
    color: "from-yellow-100 to-orange-100",
    icon: "🍦",
  },
  "near-you": {
    name: "NEAR YOU",
    color: "from-blue-100 to-cyan-100",
    icon: "🍔",
  },
  popular: {
    name: "POPULAR",
    color: "from-purple-100 to-pink-100",
    icon: "⭐",
  },
};

const DEALS_LIMIT = 4; // Sales: 4 món
const PRODUCTS_LIMIT = 6; // Products: 6 món

export default function HomePage({
  onNavigate,
  favorites,
  onToggleFavorite,
}: HomePageProps) {
  const [deals, setDeals] = useState<FoodItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [voucherCount, setVoucherCount] = useState<number | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCollection, setActiveCollection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load meta (category/collection)
  useEffect(() => {
    const loadMeta = async () => {
      const { data, error } = await supabase
        .from("food_items")
        .select("category, collection");
      if (!error && data) {
        const cat = Array.from(
          new Set(
            data
              .map((r) => r.category?.trim().toLowerCase())
              .filter((v): v is string => !!v)
          )
        );
        const col = Array.from(
          new Set(
            data
              .map((r) => r.collection?.trim().toLowerCase())
              .filter((v): v is string => !!v)
          )
        );
        setCategories(cat);
        setCollections(col);
      }
    };
    loadMeta();
  }, []);

  // Load restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, cuisine, time_minutes, rating, image_url, tags")
        .order("rating", { ascending: false })
        .limit(10);
      if (!error) setRestaurants(data ?? []);
    };
    loadRestaurants();
  }, []);

  // (Tuỳ chọn) Đếm số voucher còn hiệu lực để hiển thị ở ô Voucher
  useEffect(() => {
    const fetchActiveVoucherCount = async () => {
      const { data, error } = await supabase
        .from("vouchers")
        .select("id, expiry_date, status");
      if (!error && data) {
        const today = new Date().setHours(0, 0, 0, 0);
        const active = data.filter((v: any) => {
          const s =
            v.status && v.status !== "active"
              ? v.status
              : new Date(v.expiry_date).getTime() < today
              ? "expired"
              : "active";
          return s === "active";
        }).length;
        setVoucherCount(active);
      }
    };
    fetchActiveVoucherCount().catch(() => setVoucherCount(null));
  }, []);

  // Load foods & deals theo filter
  useEffect(() => {
    const fetchData = async () => {
      const buildFoodQuery = () => {
        let q = supabase
          .from("food_items")
          .select("id, name, image_url, price, rating, category, collection");
        if (activeCategory !== "all") q = q.eq("category", activeCategory);
        if (activeCollection !== "all")
          q = q.eq("collection", activeCollection);
        if (searchQuery.trim()) q = q.ilike("name", `%${searchQuery.trim()}%`);
        return q;
      };

      // Sales: chỉ 4 món, ưu tiên rating cao
      const dealsQuery = buildFoodQuery()
        .ilike("collection", "%deal%")
        .order("rating", { ascending: false })
        .limit(DEALS_LIMIT);

      // Products: chỉ 6 món, ưu tiên rating cao
      const foodsQuery = buildFoodQuery()
        .order("rating", { ascending: false })
        .limit(PRODUCTS_LIMIT);

      const [{ data: dealsData }, { data: foodsData }] = await Promise.all([
        dealsQuery,
        foodsQuery,
      ]);

      setDeals(dealsData ?? []);
      setFoods(foodsData ?? []);
    };
    fetchData();
  }, [activeCategory, activeCollection, searchQuery]);

  const uiCategories = useMemo(
    () =>
      categories.map((id) => ({
        id,
        name: id.toUpperCase(),
        icon: ICON_BY_CATEGORY[id] ?? "🍽️",
      })),
    [categories]
  );

  const uiCollections = useMemo(
    () =>
      collections.map((id) => {
        const meta = LABEL_BY_COLLECTION[id] ?? {
          name: id.toUpperCase(),
          color: "from-slate-100 to-gray-100",
          icon: "🧩",
        };
        return { id, ...meta };
      }),
    [collections]
  );

  // ==== Handlers ====
  const handleCategoryClick = (id: string) => {
    setActiveCategory(activeCategory === id ? "all" : id);
    setActiveCollection("all");
  };

  const handleCollectionClick = (id: string) => {
    setActiveCollection(activeCollection === id ? "all" : id);
    setActiveCategory("all");
  };

  const handleViewAllProducts = () => {
    onNavigate("search", {
      filters: {
        category: activeCategory !== "all" ? activeCategory : undefined,
        collection: activeCollection !== "all" ? activeCollection : undefined,
        q: searchQuery.trim() || undefined,
      },
      title:
        activeCollection !== "all"
          ? LABEL_BY_COLLECTION[activeCollection]?.name ?? activeCollection
          : activeCategory !== "all"
          ? activeCategory.toUpperCase()
          : "All Products",
    });
  };

  return (
    <div className="animate-slide-in-up">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              📍
            </div>
            <span className="text-xl font-bold">Home</span>
          </div>
          <div className="text-xl font-bold">9:41</div>
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 gap-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const q = searchQuery.trim();
                if (q) onNavigate("search", { initialQuery: q });
              }
            }}
            className="flex-1 outline-none text-foreground text-sm"
          />
          <button
            onClick={() => {
              const q = searchQuery.trim();
              if (q) onNavigate("search", { initialQuery: q });
            }}
            className="text-primary font-bold text-sm"
          >
            Go
          </button>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="p-4">
        <div
          className="gradient-cyan-purple text-white rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          onClick={() => onNavigate("join-party")}
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="text-sm font-medium mb-2">Join Party</div>
            <div className="text-3xl font-bold mb-4">$1</div>
            <button className="bg-cyan-400 text-cyan-900 px-4 py-2 rounded font-bold text-sm hover-lift">
              SEE MORE
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      {!!uiCategories.length && (
        <div className="px-4 py-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {uiCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center gap-2 min-w-fit transition-all ${
                  activeCategory === cat.id ? "opacity-100" : "opacity-60"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-br from-cyan-100 to-blue-100 scale-110"
                      : "bg-gray-100"
                  }`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vouchers (click => voucher) */}
      <div className="px-4 py-2">
        <div
          className="bg-cyan-100 text-cyan-700 rounded-lg p-3 flex items-center gap-2 text-sm cursor-pointer hover:bg-cyan-200 transition"
          onClick={() => onNavigate("voucher")}
          aria-label="Open vouchers"
        >
          <span>🎟️</span>
          <span>
            You have {voucherCount !== null ? voucherCount : 5} voucher
            {(voucherCount ?? 5) !== 1 ? "s" : ""} here
          </span>
          <ChevronRight size={16} className="ml-auto" />
        </div>
      </div>

      {/* Collections */}
      {!!uiCollections.length && (
        <div className="px-4 py-4">
          <h3 className="font-bold text-lg mb-3">Collections</h3>
          <div className="grid grid-cols-2 gap-3">
            {uiCollections.map((col) => (
              <div
                key={col.id}
                onClick={() => handleCollectionClick(col.id)}
                className={`bg-gradient-to-br ${
                  col.color
                } rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all ${
                  activeCollection === col.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <span className="font-bold text-sm">{col.name}</span>
                <span className="text-2xl">{col.icon}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products (6 món, View all sẽ điều hướng) */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">
            {activeCollection !== "all"
              ? `Products · ${
                  LABEL_BY_COLLECTION[activeCollection]?.name ??
                  activeCollection.toUpperCase()
                }`
              : activeCategory !== "all"
              ? `Products · ${activeCategory.toUpperCase()}`
              : "Products"}
          </h3>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {foods.length} item{foods.length !== 1 ? "s" : ""}
            </span>
            <button
              className="text-primary text-sm font-medium"
              onClick={handleViewAllProducts}
            >
              View all
            </button>
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="text-sm text-muted-foreground border rounded-lg p-4">
            Không có sản phẩm phù hợp. Hãy thử đổi bộ lọc hoặc từ khóa.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {foods.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border hover:shadow transition cursor-pointer overflow-hidden"
                onClick={() => {
                  const cardImageSrc = f.image_url || "/placeholder.jpg";
                  onNavigate("food-details", {
                    ...f,
                    __resolvedImage: cardImageSrc,
                  });
                }}
              >
                <img
                  src={f.image_url || "/placeholder.jpg"}
                  alt={f.name}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2">
                  <div className="text-sm font-semibold line-clamp-1">
                    {f.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <span>⭐ {f.rating ?? "—"}</span>
                    <span>•</span>
                    <span>${f.price ?? "—"}</span>
                  </div>
                  {f.collection && (
                    <div className="mt-2">
                      <span
                        className={`text-[10px] px-2 py-1 rounded ${
                          (f.collection || "").includes("free")
                            ? "bg-orange-100 text-orange-700"
                            : "bg-cyan-100 text-cyan-700"
                        }`}
                      >
                        {f.collection}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended (restaurants) */}
      {!!restaurants.length && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Recommended for you</h3>
            <button
              className="text-primary text-sm font-medium"
              onClick={() => onNavigate("restaurants", { sort: "rating_desc" })}
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                onClick={() => onNavigate("restaurant", rest)}
                className="flex gap-3 cursor-pointer hover:shadow-md transition-all rounded-lg p-2"
              >
                <img
                  src={rest.image_url || "/placeholder.jpg"}
                  alt={rest.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{rest.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {rest.cuisine}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs">
                      ⏱️ {rest.time_minutes ?? "—"} mins
                    </span>
                    <span className="text-xs">⭐ {rest.rating ?? "—"}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {(rest.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          tag.toLowerCase().includes("free")
                            ? "bg-orange-100 text-orange-700"
                            : "bg-cyan-100 text-cyan-700"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales (deals) - 4 món */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Sale up to 50%</h3>
          <button
            className="text-primary text-sm font-medium"
            onClick={() =>
              onNavigate("search", {
                filters: { collectionLike: "deal" },
                title: "Deals",
              })
            }
          >
            View all
          </button>
        </div>
        <div className="space-y-3">
          {deals.length === 0 ? (
            <div className="text-sm text-muted-foreground border rounded-lg p-4">
              Chưa có deal nào phù hợp.
            </div>
          ) : (
            deals.map((deal) => (
              <div
                key={deal.id}
                className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                onClick={() => onNavigate("food-details", deal)}
              >
                <img
                  src={deal.image_url || "/placeholder.jpg"}
                  alt={deal.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                  <div className="text-white flex-1">
                    <div className="font-bold">{deal.name}</div>
                    <div className="text-xs">⭐ {deal.rating ?? "—"}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(deal);
                    }}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-all"
                    aria-label="Toggle favorite"
                  >
                    ❤️
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -25%
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
