"use client";

import { ChevronLeft, Minus, Plus, Star, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/app/store/cart-context"; // ✅ thêm
import { supabase } from "@/lib/supabase/client";
import { getCartKey } from "@/app/lib/cartKey";
import { useFavorites } from "@/hooks/useFavorites";

interface FoodDetailsPageProps {
  data: any;
  onNavigate: (page: string, data?: any) => void;
  favorites: any[];
  onToggleFavorite: (item: any) => void;
}

export default function FoodDetailsPage({
  data,
  onNavigate,
}: // favorites,
// onToggleFavorite,
FoodDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedSpiciness, setSelectedSpiciness] = useState("Hot");
  const [toppings, setToppings] = useState<string[]>([
    "Corn",
    "Cheese Cheddar",
  ]);
  const [note, setNote] = useState("");

  // ✅ THÊM: dùng hook Realtime + Anonymous
  const { isFav, toggle, loading: favLoading } = useFavorites();
  const isFavorite = data?.id ? isFav(String(data.id)) : false;

  // ✅ lấy hàm addItem từ store
  const { addItem } = useCart();

  // 🆕 Lấy userId từ Supabase session (để ghi/xoá favorites)
  // const [userId, setUserId] = useState<string | null>(null);
  // useEffect(() => {
  //   (async () => {
  //     // lấy session hiện có
  //     const { data: s1, error: e1 } = await supabase.auth.getSession();
  //     if (s1?.session?.user?.id) {
  //       setUserId(s1.session.user.id);
  //       return;
  //     }
  //     // nếu chưa có → tạo anonymous session
  //     const { data: s2, error: e2 } = await supabase.auth.signInAnonymously();
  //     if (e2) {
  //       console.error("Anonymous sign-in failed:", e2);
  //       return;
  //     }
  //     setUserId(s2.user?.id ?? null);
  //   })();
  // }, []);

  // ====== Helpers ======
  // const isFavorite = favorites.some((f) => String(f.id) === String(data?.id));
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const currency = (v: number) => `$${v.toFixed(2)}`;

  const placeholder = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#e5f3ff'/>
              <stop offset='100%' stop-color='#c7e8ff'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' fill='url(#g)'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial, sans-serif' font-size='28' fill='#1570ef'>
            Loading image…
          </text>
        </svg>`
      )}`,
    []
  );

  const normalizeImageUrl = (raw?: string) => {
    if (!raw || typeof raw !== "string") return "";
    let url = raw.trim();
    if (url.startsWith("data:") || url.startsWith("blob:")) return url;
    if (url.startsWith("/")) return url;
    if (url.startsWith("//")) url = "https:" + url;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    url = url.replace(/^http:\/\//i, "https://");
    return url;
  };

  const pickImageFromData = (d: any): string => {
    if (!d) return "";
    const candidates: Array<string | undefined> = [
      d.__resolvedImage,
      d.image_url,
      d.imageURL,
      d.imageUrl,
      d.image,
      d.photoUrl,
      d.url,
      d.thumbnail,
      d.thumb,
      d.photo,
      d.picture,
      d.img,
      d.cover,
      d.media?.url,
      Array.isArray(d.images) ? d.images[0] : undefined,
    ];
    for (const c of candidates) {
      const u = normalizeImageUrl(c);
      if (u) return u;
    }
    return "";
  };

  const computeImage = () => pickImageFromData(data) || placeholder;
  const [imageSrc, setImageSrc] = useState<string>(computeImage());

  useEffect(() => {
    setImageSrc(computeImage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, data?.__resolvedImage]);

  // ====== Hiển thị text & rating ======
  const displayName = data?.name || "Fried Chicken";
  const displayDesc = data?.description || "Crispy fried wings, thigh";
  const ratingValue =
    typeof data?.rating === "number" ? clamp(data.rating, 0, 5) : 4.5;
  const categoryChip = data?.category ? String(data.category) : "";
  const collectionChip = data?.collection ? String(data.collection) : "";

  // ====== Giá & tính tiền ======
  const safeBasePrice = Number.isFinite(Number(data?.price))
    ? Number(data?.price)
    : 15;
  const basePrice = safeBasePrice;
  const sizePrice = selectedSize === "L" ? 10 : selectedSize === "M" ? 5 : 0;
  const toppingPrice = toppings.reduce((sum, topping) => {
    const prices: Record<string, number> = {
      Corn: 2,
      "Cheese Cheddar": 5,
      "Salted egg": 10,
    };
    return sum + (prices[topping] || 0);
  }, 0);
  const totalPrice = (basePrice + sizePrice + toppingPrice) * quantity;
  const formattedTotal = currency(totalPrice);

  const toggleTopping = (topping: string) => {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const reviews = [
    {
      name: "Sarah",
      rating: 5,
      text: "Absolutely delicious! Best chicken I've had.",
      avatar: "👩",
    },
    {
      name: "John",
      rating: 4,
      text: "Great taste, portion could be bigger.",
      avatar: "👨",
    },
  ];

  // ====== Back button ======
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    if (data?.restaurant) {
      onNavigate("restaurant", data.restaurant);
      return;
    }
    onNavigate("home");
  };

  // ✅ Handler thêm vào giỏ (cập nhật badge)
  // ================== ADD TO CART ==================
  const handleAddToCart = async () => {
    try {
      console.log("🧩 DEBUG START - Add to cart -------------------");
      console.log("DEBUG => full data object:", data);
      console.log("DEBUG => data.id:", data?.id, typeof data?.id);
      console.log("DEBUG => data.restaurant_id:", data?.restaurant_id);
      console.log("DEBUG => data.restaurant:", data?.restaurant);
      console.log("DEBUG => data.restaurant?.id:", data?.restaurant?.id);
      console.log("DEBUG => data.restaurant_name:", data?.restaurant_name);

      // ✅ Đảm bảo data.id tồn tại và là chuỗi UUID
      const food_item_id = data?.id ? String(data.id).trim() : null;
      if (!food_item_id) {
        alert("Thiếu hoặc sai food_item_id");
        return;
      }

      const cart_key = await getCartKey();
      const options_key = `${selectedSize}|${[...toppings]
        .sort()
        .join("+")}|${selectedSpiciness}`;
      const price = Number(basePrice + sizePrice + toppingPrice);

      // ✅ Bằng đoạn này:
      let restaurantId = data?.restaurant_id || null;
      let restaurantName = data?.restaurant_name || null;

      // Nếu Supabase trả về array
      if (Array.isArray(data?.restaurants) && data.restaurants.length > 0) {
        restaurantId = data.restaurants[0].id;
        restaurantName = data.restaurants[0].name;
      }
      // Nếu Supabase trả về object
      else if (data?.restaurants && typeof data.restaurants === "object") {
        restaurantId = data.restaurants.id || restaurantId;
        restaurantName = data.restaurants.name || restaurantName;
      }

      console.log("✅ Final restaurantId:", restaurantId);
      console.log("✅ Final restaurantName:", restaurantName);

      const row = {
        cart_key,
        food_item_id,
        options_key,
        name: displayName,
        price,
        quantity,
        image: imageSrc,
        restaurant_id: restaurantId,
        restaurant: restaurantName,
        meta: {
          size: selectedSize,
          spiciness: selectedSpiciness,
          toppings,
          note,
          raw: data,
        },
      };

      console.log("🧾 DEBUG => inserting row:", row);

      // Kiểm tra nếu item đã có trong cart
      const { data: exists, error: selectError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_key", cart_key)
        .eq("food_item_id", food_item_id)
        .eq("options_key", options_key)
        .maybeSingle();

      if (selectError) {
        console.error("❌ Select failed:", selectError);
        alert("Không thể kiểm tra cart_items (selectError)");
        return;
      }

      if (exists?.id) {
        const newQty = (exists.quantity || 0) + quantity;
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: newQty })
          .eq("id", exists.id);

        if (updateError) {
          console.error("❌ Update failed:", updateError);
          alert("Lỗi khi cập nhật số lượng");
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert([row]);

        if (insertError) {
          console.error("❌ Insert failed:", insertError);
          alert("Lỗi khi thêm vào giỏ hàng: " + insertError.message);
          return;
        }
      }

      window.dispatchEvent(
        new CustomEvent("cart:changed", {
          detail: { reason: "add", qtyDelta: quantity },
        })
      );

      console.log("✅ Item added successfully, navigating to cart.");
      console.log("🧩 DEBUG END - Add to cart ---------------------");
      onNavigate("cart");
    } catch (error) {
      console.error("🚨 Unexpected error:", error);
      const errMsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      alert("❌ Add to cart failed: " + (errMsg || "Unknown error"));
    }
  };

  // ================== TOGGLE FAVORITE (TEXT id OK) ==================
  // 🔧 SỬA: gọi hook toggle -> realtime sẽ tự cập nhật
  const handleToggleFavorite = async () => {
    if (!data?.id) return;
    await toggle(String(data.id), {
      name: displayName,
      image: imageSrc,
      price: basePrice,
    });
  };

  return (
    <div
      key={String(data?.id ?? data?.name ?? "detail")}
      className="animate-slide-in-up"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={displayName}
          className="w-full h-64 object-cover"
          loading="lazy"
          fetchPriority="high"
          onError={() => setImageSrc(placeholder)}
        />
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 bg-white rounded-full p-2 hover:bg-gray-100"
          aria-label="Back"
          title="Back"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 🆕 dùng handler mới để lưu DB */}
        <button
          onClick={handleToggleFavorite}
          disabled={favLoading || !data?.id} // ✅ THÊM
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-all"
          aria-label="Toggle favorite"
          title="Favorite"
        >
          <Heart
            size={24}
            fill={isFavorite ? "red" : "none"}
            color={isFavorite ? "red" : "black"}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <span className="text-2xl font-bold text-primary">
              ${basePrice}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{displayDesc}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(ratingValue)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                  fill={i < Math.round(ratingValue) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({ratingValue.toFixed(1)})
            </span>
          </div>

          {(categoryChip || collectionChip) && (
            <div className="mt-2 flex gap-2">
              {categoryChip && (
                <span className="text-[10px] px-2 py-1 rounded bg-cyan-100 text-cyan-700">
                  {categoryChip}
                </span>
              )}
              {collectionChip && (
                <span
                  className={`text-[10px] px-2 py-1 rounded ${
                    collectionChip.toLowerCase().includes("free")
                      ? "bg-orange-100 text-orange-700"
                      : "bg-cyan-100 text-cyan-700"
                  }`}
                >
                  {collectionChip}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Size (Pick 1)</h3>
            <span className="text-cyan-600 text-sm">Required</span>
          </div>
          <div className="space-y-2">
            {[
              { size: "S", price: 0 },
              { size: "M", price: 5 },
              { size: "L", price: 10 },
            ].map((s) => (
              <label
                key={s.size}
                className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="size"
                  value={s.size}
                  checked={selectedSize === s.size}
                  onChange={() => setSelectedSize(s.size)}
                  className="w-4 h-4"
                />
                <span className="flex-1 font-medium">{s.size}</span>
                {s.price > 0 && (
                  <span className="text-sm text-primary">+${s.price}</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Toppings */}
        <div>
          <h3 className="font-bold mb-2">Toppings (Optional)</h3>
          <div className="space-y-2">
            {["Corn", "Cheese Cheddar", "Salted egg"].map((topping) => (
              <label
                key={topping}
                className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={toppings.includes(topping)}
                  onChange={() => toggleTopping(topping)}
                  className="w-4 h-4"
                />
                <span className="flex-1">{topping}</span>
                <span className="text-sm text-muted-foreground">
                  +$
                  {topping === "Corn"
                    ? 2
                    : topping === "Cheese Cheddar"
                    ? 5
                    : 10}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Spiciness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Spiciness (Pick 1)</h3>
            <span className="text-cyan-600 text-sm">Required</span>
          </div>
          <div className="space-y-2">
            {["No", "Hot", "Very hot"].map((level) => (
              <label
                key={level}
                className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="spiciness"
                  value={level}
                  checked={selectedSpiciness === level}
                  onChange={() => setSelectedSpiciness(level)}
                  className="w-4 h-4"
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <h3 className="font-bold mb-2">Special Instructions</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any special requests here..."
            className="w-full p-3 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>

        {/* Reviews */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-bold text-sm mb-2">Customer Reviews</h4>
          <div className="space-y-2">
            {reviews.map((review, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center gap-2">
                  <span>{review.avatar}</span>
                  <span className="font-medium">{review.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="text-yellow-400"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground ml-6">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity & Add to cart */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={20} />
          </button>
          <span className="flex-1 text-center font-bold text-lg">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={20} />
          </button>

          {/* ✅ Gọi handleAddToCart để cập nhật store + badge */}
          <button
            onClick={handleAddToCart}
            className="flex-1 gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Add to cart ({formattedTotal})
          </button>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
}
