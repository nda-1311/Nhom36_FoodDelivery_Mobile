"use client"

import { MapPin, Phone, MessageSquare, Clock, Navigation } from "lucide-react"
import { useState, useEffect } from "react"

interface MapTrackingPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function MapTrackingPage({ onNavigate }: MapTrackingPageProps) {
  const [driverPosition, setDriverPosition] = useState({ x: 45, y: 35 })

  useEffect(() => {
    const timer = setInterval(() => {
      setDriverPosition((prev) => ({
        x: Math.min(prev.x + Math.random() * 2, 85),
        y: Math.min(prev.y + Math.random() * 2, 75),
      }))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const driver = {
    name: "John Cooper",
    avatar: "J",
    rating: 4.8,
    vehicle: "Honda Civic - ABC 1234",
  }

  const deliveryInfo = {
    time: "15-20 mins",
    address: "201 Katlian No.21 Street",
  }

  return (
    <div className="animate-slide-in-up pb-20 flex flex-col min-h-screen">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Delivery Tracking</h1>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
        {/* Map Background */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Streets */}
          <path d="M 0 30 Q 50 25 100 35" stroke="#d1d5db" strokeWidth="2" fill="none" />
          <path d="M 10 0 L 15 100" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
          <path d="M 40 0 L 35 100" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
          <path d="M 70 0 L 75 100" stroke="#d1d5db" strokeWidth="1.5" fill="none" />

          {/* Delivery Route */}
          <path
            d={`M 20 20 Q ${driverPosition.x} ${driverPosition.y} 80 80`}
            stroke="#06b6d4"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="2,2"
          />

          {/* Destination Pin */}
          <circle cx="80" cy="80" r="3" fill="#06b6d4" />
          <circle cx="80" cy="80" r="5" fill="none" stroke="#06b6d4" strokeWidth="1" />

          {/* Driver Position */}
          <circle cx={driverPosition.x} cy={driverPosition.y} r="2.5" fill="#06b6d4" className="animate-pulse" />
          <circle cx={driverPosition.x} cy={driverPosition.y} r="4" fill="none" stroke="#06b6d4" strokeWidth="1" />

          {/* Pickup Location */}
          <circle cx="20" cy="20" r="2" fill="#9ca3af" />
          <circle cx="20" cy="20" r="4" fill="none" stroke="#9ca3af" strokeWidth="1" />
        </svg>

        {/* Map Overlay Icons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <Navigation size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="p-4 space-y-4">
        {/* Time and Address */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Delivery time</p>
              <p className="font-bold text-lg">{deliveryInfo.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Delivery address</p>
              <p className="font-bold">{deliveryInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        <div className="bg-cyan-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {driver.avatar}
            </div>
            <div>
              <p className="font-bold">{driver.name}</p>
              <p className="text-xs text-muted-foreground">Food Delivery</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate("call")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Phone size={18} className="text-primary" />
            </button>
            <button
              onClick={() => onNavigate("chat")}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-cyan-50 transition-colors">
          Need help?
        </button>
        <button
          onClick={() => onNavigate("home")}
          className="w-full text-muted-foreground py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
