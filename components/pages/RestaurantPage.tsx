"use client";

import { ChevronLeft, Star, Clock, MapPin, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface RestaurantPageProps {
  data: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function RestaurantPage({
  data,
  onNavigate,
}: RestaurantPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");

  // ✅ Bổ sung phần lấy ảnh giống HomePage
  const placeholder = "/placeholder.svg?height=200&width=400&query=restaurant";
  const imageSrc =
    data?.__resolvedImage || data?.image_url || data?.image || placeholder;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    onNavigate("home");
  };

  // Mock dữ liệu menu
  const menuItems = [
    {
      id: 1,
      name: "Fried Chicken",
      description: "Crispy fried wings, thigh",
      price: 15,
      rating: 4.5,
      reviews: 99,
      image: "/crispy-fried-chicken.png",
      category: "Main",
    },
    {
      id: 2,
      name: "Chicken Salad",
      description: "Fresh greens with chicken",
      price: 15,
      rating: 4.5,
      reviews: 99,
      image: "/creamy-chicken-salad.png",
      category: "Main",
    },
    {
      id: 3,
      name: "Spicy Chicken",
      description: "Hot and spicy chicken",
      price: 15,
      rating: 4.5,
      reviews: 99,
      image: "/spicy-chicken.jpg",
      category: "Main",
    },
    {
      id: 4,
      name: "Fried Potatos",
      description: "Golden crispy potatoes",
      price: 8,
      rating: 4.2,
      reviews: 45,
      image: "/fried-potatoes.jpg",
      category: "Sides",
    },
    {
      id: 5,
      name: "Coleslaw",
      description: "Fresh cabbage salad",
      price: 6,
      rating: 4.0,
      reviews: 32,
      image: "/coleslaw.jpg",
      category: "Sides",
    },
  ];

  const reviews = [
    {
      name: "Jinny Oslin",
      rating: 4.5,
      text: "Quick delivery, good dishes. I love the chicken burger.",
      avatar: "👩",
      date: "2 days ago",
    },
    {
      name: "Jill",
      rating: 5,
      text: "Fresh ingredients and great taste!",
      avatar: "👱‍♀️",
      date: "1 week ago",
    },
    {
      name: "Mike",
      rating: 4,
      text: "Good food, but delivery took longer than expected.",
      avatar: "👨",
      date: "2 weeks ago",
    },
  ];

  const combos = [
    {
      name: "Combo B",
      description: "Fried Chicken, Chicken Rice & Salad",
      price: 25,
      rating: 4.5,
      reviews: 90,
      image: "/combo-meal.png",
    },
    {
      name: "Combo C",
      description: "Fried Chicken (Small) & Potatos",
      price: 19,
      rating: 4.6,
      reviews: 75,
      image: "/combo-meal-small.jpg",
    },
  ];

  const categories = ["Main", "Sides", "Drinks", "Desserts"];
  const filteredItems = menuItems.filter(
    (item) => item.category === activeTab || activeTab === "menu"
  );

  return (
    <div className="animate-slide-in-up">
      {/* ✅ Header Image (sửa để dùng __resolvedImage nếu có) */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={data?.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholder;
          }}
        />
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 bg-white rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
        >
          <Heart
            size={24}
            fill={isFavorite ? "red" : "none"}
            color={isFavorite ? "red" : "black"}
          />
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 bg-white border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {data?.name || "Restaurant"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {data?.cuisine || "Cuisine"}
            </p>
          </div>
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
            <Share2 size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm">6am - 9pm</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-muted-foreground" />
            <span className="text-sm">2 km away</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">$5 - $50</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Star size={20} className="text-yellow-400" fill="currentColor" />
          <span className="font-bold">{data?.rating ?? 4.5}</span>
          <span className="text-sm text-muted-foreground">(289 reviews)</span>
        </div>

        {/* Offers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
            <span>🎟️</span>
            <span className="text-sm">2 discount vouchers available</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-cyan-50 rounded">
            <span>🚚</span>
            <span className="text-sm">Delivery in 20 mins</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-border flex gap-4 px-4 overflow-x-auto">
        {["menu", "Main", "Sides", "Drinks", "Desserts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-2 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "menu" && (
          <>
            {/* Combos */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Combo Deals</h3>
              <div className="space-y-3">
                {combos.map((combo, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      onNavigate("food-details", {
                        ...combo,
                        __resolvedImage: combo.image,
                        restaurant: data,
                      })
                    }
                    className="flex gap-3 cursor-pointer hover:shadow-md transition-all rounded-lg p-2 border border-border"
                  >
                    <img
                      src={combo.image || "/placeholder.svg"}
                      alt={combo.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{combo.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {combo.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">
                          ${combo.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star
                            size={12}
                            className="text-yellow-400"
                            fill="currentColor"
                          />
                          <span className="text-xs">{combo.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Items */}
            <h3 className="font-bold text-lg mb-3">Popular Items</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {menuItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    onNavigate("food-details", {
                      ...item,
                      __resolvedImage: item.image,
                      restaurant: data,
                    })
                  }
                  className="cursor-pointer hover:shadow-md transition-all rounded-lg overflow-hidden border border-border"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-sm text-primary">
                        ${item.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="text-xs">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <h3 className="font-bold text-lg mb-3">Customer Reviews</h3>
            <div className="space-y-3">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 pb-3 border-b border-border last:border-b-0"
                >
                  <span className="text-2xl">{review.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{review.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.floor(review.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab !== "menu" && (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  onNavigate("food-details", {
                    ...item,
                    __resolvedImage: item.image,
                    restaurant: data,
                  })
                }
                className="cursor-pointer hover:shadow-md transition-all rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm text-primary">
                      ${item.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-400"
                        fill="currentColor"
                      />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20"></div>
    </div>
  );
}
