"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

import HomePage from "@/components/pages/HomePage";
import SearchPage from "@/components/pages/SearchPage";
import RestaurantPage from "@/components/pages/RestaurantPage";
import FoodDetailsPage from "@/components/pages/FoodDetailsPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import OrderTrackingPage from "@/components/pages/OrderTrackingPage";
import ChatPage from "@/components/pages/ChatPage";
import RatingPage from "@/components/pages/RatingPage";
import CallPage from "@/components/pages/CallPage";
import MapTrackingPage from "@/components/pages/MapTrackingPage";
import LocationSelectionPage from "@/components/pages/LocationSelectionPage";
import JoinPartyPage from "@/components/pages/JoinPartyPage";
import FavoritesPage from "@/components/pages/FavoritesPage";
import InboxPage from "@/components/pages/InboxPage";
import AccountPage from "@/components/pages/AccountPage";
import InitDBPage from "@/components/pages/InitdbPage";
import BottomNav from "@/components/bottom-nav";
import VoucherPage from "@/components/pages/VoucherPage";
import { CartProvider } from "./store/cart-context";
import { useCartCount } from "../hooks/useCartCount";
import HistoryPage from "@/components/pages/HistoryPage";
import LoginPage from "@/components/pages/LoginPage";
import LogoutPage from "@/components/pages/LogoutPage";

type PageType =
  | "login"
  | "logout"
  | "home"
  | "search"
  | "restaurant"
  | "food-details"
  | "cart"
  | "checkout"
  | "order-tracking"
  | "chat"
  | "rating"
  | "call"
  | "map-tracking"
  | "location-selection"
  | "join-party"
  | "favorites"
  | "inbox"
  | "account"
  | "voucher"
  | "loading"
  | "history";

interface PageState {
  current: PageType;
  data?: any;
}

export default function App() {
  const [page, setPage] = useState<PageState>({ current: "loading" });
  const [favorites, setFavorites] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const { cartCount } = useCartCount();

  /**
   * 🧹 Dọn session Supabase cũ (đảm bảo lần đầu tiên luôn về trang Login)
   * 👉 Chạy 1 lần khi app load
   */
  // useEffect(() => {
  //   const clearOldSession = async () => {
  //     const { error } = await supabase.auth.signOut();
  //     if (!error) console.log("✅ Đã xoá session Supabase cũ");
  //   };
  //   clearOldSession();
  // }, []);

  /**
   * ✅ Kiểm tra user khi mở app
   * Nếu có user → vào Home
   * Nếu không → vào Login
   */
  useEffect(() => {
    const checkSession = async () => {
      setPage({ current: "loading" });

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      console.log("🔍 sessionData:", sessionData);

      if (!session || !session.user) {
        setUser(null);
        setPage({ current: "login" });
      } else {
        setUser(session.user);
        setPage({ current: "home" });
      }

      setAuthChecking(false);
    };

    checkSession();

    // 🔁 Lắng nghe sự kiện đăng nhập / đăng xuất
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setPage({ current: "home" });
        } else {
          setUser(null);
          setPage({ current: "login" });
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  /**
   * Chuyển trang
   */
  const navigateTo = (pageName: string, data?: any) => {
    setPage({ current: pageName as PageType, data });
  };

  /**
   * Thêm / xoá món yêu thích
   */
  const toggleFavorite = (item: any) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      return exists ? prev.filter((f) => f.id !== item.id) : [...prev, item];
    });
  };

  /**
   * Render trang chính
   */
  const renderPage = () => {
    switch (page.current) {
      case "loading":
        return (
          <div className="flex items-center justify-center h-screen text-gray-500">
            Đang kiểm tra đăng nhập...
          </div>
        );
      case "login":
        return <LoginPage onNavigate={navigateTo} />;
      case "logout":
        return <LogoutPage onNavigate={navigateTo} />;
      case "home":
        return (
          <HomePage
            onNavigate={navigateTo}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "search":
        return (
          <SearchPage
            onNavigate={navigateTo}
            initialQuery={page.data?.initialQuery}
          />
        );
      case "restaurant":
        return <RestaurantPage data={page.data} onNavigate={navigateTo} />;
      case "food-details":
        return (
          <FoodDetailsPage
            data={page.data}
            onNavigate={navigateTo}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "cart":
        return <CartPage onNavigate={navigateTo} />;
      case "checkout":
        return <CheckoutPage onNavigate={navigateTo} />;
      case "order-tracking":
        return <OrderTrackingPage onNavigate={navigateTo} />;
      case "chat":
        return <ChatPage onNavigate={navigateTo} />;
      case "rating":
        return <RatingPage onNavigate={navigateTo} />;
      case "call":
        return <CallPage onNavigate={navigateTo} />;
      case "map-tracking":
        return <MapTrackingPage onNavigate={navigateTo} />;
      case "location-selection":
        return <LocationSelectionPage onNavigate={navigateTo} />;
      case "join-party":
        return <JoinPartyPage onNavigate={navigateTo} />;
      case "favorites":
        return (
          <FavoritesPage
            onNavigate={navigateTo}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "inbox":
        return <InboxPage onNavigate={navigateTo} />;
      case "account":
        return <AccountPage onNavigate={navigateTo} />;
      case "voucher":
        return <VoucherPage onNavigate={navigateTo} />;
      case "history":
        return <HistoryPage onNavigate={navigateTo} />;
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
    }
  };

  /**
   * 🕒 Nếu đang kiểm tra đăng nhập thì hiển thị màn hình loading
   */
  if (authChecking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  /**
   * 🔹 Ẩn BottomNav khi ở trang login / logout
   */
  const hideBottomNav =
    page.current === "login" ||
    page.current === "logout" ||
    page.current === "loading";

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto bg-white relative pb-20">
          {renderPage()}
          {!hideBottomNav && (
            <BottomNav
              currentPage={page.current}
              onNavigate={navigateTo}
              cartCount={cartCount}
            />
          )}
        </div>
      </div>
    </CartProvider>
  );
}
