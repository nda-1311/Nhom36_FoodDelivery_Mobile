"use client";

import { Home, ShoppingBag, Heart, MessageSquare, User } from "lucide-react";

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: any, data?: any) => void;
  cartCount?: number; // 👈 thêm
}

export default function BottomNav({
  currentPage,
  onNavigate,
  cartCount = 0,
}: BottomNavProps) {
  const isActive = (page: string) => currentPage === page;
  const display = cartCount > 99 ? "99+" : String(cartCount);

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-border flex justify-around items-center h-20 shadow-lg">
      <button
        onClick={() => onNavigate("home")}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-smooth ${
          isActive("home")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Home size={24} className="transition-smooth" />
        <span className="text-xs transition-smooth">Home</span>
      </button>

      <button
        onClick={() => onNavigate("cart")}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-smooth relative ${
          isActive("cart")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <ShoppingBag size={24} className="transition-smooth" />
        <span className="text-xs transition-smooth">My order</span>

        {cartCount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center animate-pulse-glow font-bold">
            {display}
          </span>
        )}
      </button>

      <button
        onClick={() => onNavigate("favorites")}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-smooth ${
          isActive("favorites")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Heart size={24} className="transition-smooth" />
        <span className="text-xs transition-smooth">Favorites</span>
      </button>
      <button
        onClick={() => onNavigate("inbox")}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-smooth ${
          isActive("inbox")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <MessageSquare size={24} className="transition-smooth" />
        <span className="text-xs transition-smooth">Inbox</span>
      </button>
      <button
        onClick={() => onNavigate("account")}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-smooth ${
          isActive("account")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <User size={24} className="transition-smooth" />
        <span className="text-xs transition-smooth">Account</span>
      </button>
    </div>
  );
}
