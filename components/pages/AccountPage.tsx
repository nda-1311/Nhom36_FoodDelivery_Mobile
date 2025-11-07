"use client";

import {
  ChevronLeft,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Star,
  Edit2,
} from "lucide-react";
import { useState } from "react";

interface AccountPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = {
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    address: "201 Katlian No.21 Street, San Francisco, CA",
    rating: 4.8,
    totalOrders: 42,
    memberSince: "January 2023",
    avatar: "JD",
  };

  return (
    <div className="animate-slide-in-up">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 flex items-center gap-3">
        <button onClick={() => onNavigate("home")} className="hover-lift">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Account</h1>
      </div>

      {/* Profile Section */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold text-3xl">
            {userInfo.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userInfo.name}</h2>
            <div className="flex items-center gap-1 mt-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{userInfo.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({userInfo.totalOrders} orders)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {userInfo.memberSince}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white rounded-lg transition-all"
          >
            <Edit2 size={20} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Account Information */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-lg mb-3">Account Information</h3>
        <div className="space-y-3">
          {/* Name */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-semibold text-sm">{userInfo.name}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Phone Number</p>
              <p className="font-semibold text-sm">{userInfo.phone}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-semibold text-sm">{userInfo.email}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Delivery Address</p>
              <p className="font-semibold text-sm">{userInfo.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-lg mb-3">Your Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {userInfo.totalOrders}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {userInfo.rating}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Rating</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">5</p>
            <p className="text-xs text-muted-foreground mt-1">Vouchers</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-lg mb-3">Settings</h3>
        <div className="space-y-2">
          <button
            onClick={() => onNavigate("history")}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between"
          >
            <span className="font-semibold text-sm">📜 View Order History</span>
            <span className="text-muted-foreground">→</span>
          </button>

          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between">
            <span className="font-semibold text-sm">Notifications</span>
            <span className="text-muted-foreground">→</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between">
            <span className="font-semibold text-sm">Payment Methods</span>
            <span className="text-muted-foreground">→</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between">
            <span className="font-semibold text-sm">Privacy & Security</span>
            <span className="text-muted-foreground">→</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between">
            <span className="font-semibold text-sm">Help & Support</span>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 py-4">
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover-lift">
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="h-8"></div>
    </div>
  );
}
