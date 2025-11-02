"use client"

import { MapPin, Edit2, Home, Briefcase, MoreHorizontal } from "lucide-react"
import { useState } from "react"

interface LocationSelectionPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function LocationSelectionPage({ onNavigate }: LocationSelectionPageProps) {
  const [selectedType, setSelectedType] = useState("home")
  const [address, setAddress] = useState("201 Katlian No.21 Street")
  const [isEditing, setIsEditing] = useState(false)

  const locationTypes = [
    { id: "home", label: "Home", icon: Home },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "other", label: "Other", icon: MoreHorizontal },
  ]

  return (
    <div className="animate-slide-in-up pb-20 flex flex-col min-h-screen">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Select location</h1>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
        {/* Map Background */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid2" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid2)" />

          {/* Streets */}
          <path d="M 0 30 Q 50 25 100 35" stroke="#d1d5db" strokeWidth="2" fill="none" />
          <path d="M 10 0 L 15 100" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
          <path d="M 40 0 L 35 100" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
          <path d="M 70 0 L 75 100" stroke="#d1d5db" strokeWidth="1.5" fill="none" />

          {/* Location Pin */}
          <circle cx="50" cy="50" r="3" fill="#06b6d4" />
          <circle cx="50" cy="50" r="6" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* Center Pin Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-2 border-primary rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Address Display */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Address</label>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            <MapPin size={20} className="text-primary flex-shrink-0" />
            {isEditing ? (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-medium"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-sm font-medium">{address}</span>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary hover:bg-white rounded p-1 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        {/* Location Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Location type</label>
          <div className="space-y-2">
            {locationTypes.map((type) => {
              const Icon = type.icon
              return (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary"
                  style={{
                    borderColor: selectedType === type.id ? "var(--primary)" : "var(--border)",
                    backgroundColor: selectedType === type.id ? "rgba(6, 182, 212, 0.05)" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="location-type"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Icon size={20} className="text-primary" />
                  <span className="font-medium">{type.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate("checkout")}
          className="w-full gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
