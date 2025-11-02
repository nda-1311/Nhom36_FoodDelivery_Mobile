"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, X, SlidersHorizontal } from "lucide-react";

type FoodItem = {
  id: string | number;
  name: string;
  image_url: string | null;
  price: number | null;
  rating: number | null;
  category: string | null;
  collection: string | null;
};

type SearchFilters = {
  q?: string;
  category?: string;
  collection?: string;
  collectionLike?: string; // ví dụ: "deal"
};

interface SearchPageProps {
  onNavigate: (page: string, data?: any) => void;
  // có thể được truyền từ HomePage:
  initialQuery?: string;
  filters?: SearchFilters;
  title?: string;
}

const PAGE_SIZE = 12 as const;

const SORT_OPTIONS = [
  { id: "rating_desc", label: "Rating ↓" },
  { id: "price_asc", label: "Price ↑" },
  { id: "price_desc", label: "Price ↓" },
  { id: "newest", label: "Newest" },
] as const;

export default function SearchPage({
  onNavigate,
  initialQuery,
  filters: initialFilters,
  title,
}: SearchPageProps) {
  // ==== State ====
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // form controls
  const [q, setQ] = useState(initialFilters?.q ?? initialQuery ?? "");
  const [category, setCategory] = useState(initialFilters?.category ?? "");
  const [collection, setCollection] = useState(
    initialFilters?.collection ?? ""
  );
  const [collectionLike, setCollectionLike] = useState(
    initialFilters?.collectionLike ?? ""
  );
  const [sort, setSort] =
    useState<(typeof SORT_OPTIONS)[number]["id"]>("rating_desc");

  // metadata (để build dropdown filters)
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);

  // ==== Load meta: categories & collections ====
  useEffect(() => {
    (async () => {
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
        ).sort();
        const col = Array.from(
          new Set(
            data
              .map((r) => r.collection?.trim().toLowerCase())
              .filter((v): v is string => !!v)
          )
        ).sort();
        setCategories(cat);
        setCollections(col);
      }
    })();
  }, []);

  // ==== Query builder ====
  const applySort = (qBuilder: ReturnType<typeof supabase.from> & any) => {
    switch (sort) {
      case "price_asc":
        return qBuilder.order("price", { ascending: true, nullsFirst: true });
      case "price_desc":
        return qBuilder.order("price", { ascending: false, nullsFirst: true });
      case "newest":
        return qBuilder.order("created_at", { ascending: false });
      case "rating_desc":
      default:
        return qBuilder.order("rating", { ascending: false, nullsFirst: true });
    }
  };

  const fetchPage = async (pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let qBuilder = supabase
        .from("food_items")
        .select("id, name, image_url, price, rating, category, collection", {
          count: "exact",
        });

      if (category) qBuilder = qBuilder.eq("category", category);
      if (collection) qBuilder = qBuilder.eq("collection", collection);
      if (collectionLike)
        qBuilder = qBuilder.ilike("collection", `%${collectionLike}%`);
      if (q.trim()) qBuilder = qBuilder.ilike("name", `%${q.trim()}%`);

      qBuilder = applySort(qBuilder).range(from, to);

      const { data, error, count } = await qBuilder;
      if (error) throw error;

      if (pageIndex === 0) {
        setFoods(data ?? []);
      } else {
        setFoods((prev) => [...prev, ...(data ?? [])]);
      }

      const total = count ?? 0;
      setHasMore(to + 1 < total);
      setPage(pageIndex);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  // fetch initial (và mỗi khi filter/sort thay đổi)
  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, collection, collectionLike, q, sort]);

  // ==== Helpers UI ====
  const activeChips = useMemo(
    () =>
      [
        q ? { type: "q", label: `“${q}”` } : null,
        category ? { type: "category", label: category } : null,
        collection ? { type: "collection", label: collection } : null,
        collectionLike
          ? { type: "collectionLike", label: `contains: ${collectionLike}` }
          : null,
      ].filter(Boolean) as { type: keyof SearchFilters | "q"; label: string }[],
    [q, category, collection, collectionLike]
  );

  const clearChip = (type: keyof SearchFilters | "q") => {
    if (type === "q") setQ("");
    if (type === "category") setCategory("");
    if (type === "collection") setCollection("");
    if (type === "collectionLike") setCollectionLike("");
  };

  const clearAll = () => {
    setQ("");
    setCategory("");
    setCollection("");
    setCollectionLike("");
    setSort("rating_desc");
  };

  return (
    <div className="min-h-screen animate-slide-in-up">
      {/* Header */}
      <div className="sticky top-0 z-10 gradient-cyan-blue text-white p-4 pt-6">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => onNavigate("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-lg font-bold truncate">{title || "Search"}</div>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white rounded-lg px-3 py-2 gap-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchPage(0);
            }}
            placeholder="Search foods…"
            className="flex-1 outline-none text-foreground text-sm"
          />
          {!!q && (
            <button
              className="text-xs text-primary"
              onClick={() => setQ("")}
              title="Clear"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-sm flex items-center gap-2">
            <SlidersHorizontal size={16} />
            Filters
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="text-sm border rounded px-2 py-1 bg-white"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter rows */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 text-sm border rounded px-2 py-2 bg-white"
            >
              <option value="">Category — All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="flex-1 text-sm border rounded px-2 py-2 bg-white"
            >
              <option value="">Collection — All</option>
              {collections.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              value={collectionLike}
              onChange={(e) => setCollectionLike(e.target.value)}
              placeholder="Collection contains… (e.g. deal)"
              className="flex-1 text-sm border rounded px-3 py-2 bg-white"
            />
            <button
              className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
              onClick={clearAll}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Active chips */}
        {!!activeChips.length && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeChips.map((chip) => (
              <span
                key={chip.type}
                className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded inline-flex items-center gap-1"
              >
                {chip.label}
                <button
                  onClick={() => clearChip(chip.type)}
                  className="hover:text-cyan-900"
                  aria-label={`Remove ${chip.type}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {foods.map((f) => (
            <div
              key={f.id}
              className="rounded-lg border hover:shadow transition cursor-pointer overflow-hidden"
              onClick={() => onNavigate("food-details", f)}
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
                {!!f.collection && (
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

        {/* Empty state */}
        {!loading && foods.length === 0 && (
          <div className="text-sm text-muted-foreground border rounded-lg p-4 mt-3">
            Không có kết quả phù hợp. Hãy thử đổi bộ lọc hoặc từ khóa.
          </div>
        )}

        {/* Load more */}
        <div className="flex items-center justify-center mt-4">
          {hasMore ? (
            <button
              disabled={loading}
              onClick={() => fetchPage(page + 1)}
              className="px-4 py-2 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          ) : (
            foods.length > 0 && (
              <div className="text-xs text-muted-foreground">Hết kết quả</div>
            )
          )}
        </div>

        {/* Error */}
        {error && <div className="text-xs text-red-600 mt-3">{error}</div>}
      </div>
    </div>
  );
}
