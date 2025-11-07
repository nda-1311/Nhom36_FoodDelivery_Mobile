"use client";

import { useState, useEffect } from "react";
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

type PageType =
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
  | "history";

interface PageState {
  current: PageType;
  data?: any;
}

export default function App() {
  const [page, setPage] = useState<PageState>({ current: "home" });
  const [favorites, setFavorites] = useState<any[]>([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const { cartCount } = useCartCount();

  useEffect(() => {
    const initialized = localStorage.getItem("db_initialized");
    if (initialized) {
      setDbInitialized(true);
    }
  }, []);

  const navigateTo: (pageName: string, data?: any) => void = (
    pageName,
    data
  ) => {
    setPage({ current: pageName as PageType, data });
  };
  const toggleFavorite = (item: any) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem("db_initialized", "true");
    setDbInitialized(true);
  }, []);

  const renderPage = () => {
    switch (page.current) {
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

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto bg-white relative pb-20">
          {renderPage()}
          <BottomNav
            currentPage={page.current}
            onNavigate={navigateTo}
            cartCount={cartCount}
          />
        </div>
      </div>
    </CartProvider>
  );
}
