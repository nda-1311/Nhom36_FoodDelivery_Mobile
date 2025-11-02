"use client"

import { CheckCircle, Phone, MessageSquare, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface OrderTrackingPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function OrderTrackingPage({ onNavigate }: OrderTrackingPageProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const newProgress = prev + 1
          setCurrentStep(Math.floor(newProgress / 20))
          return newProgress
        }
        return 100
      })
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    { name: "Order\nConfirmed", icon: "✓", completed: progress > 0 },
    { name: "Looking for\nDriver", icon: "🔍", completed: progress > 20 },
    { name: "Preparing\nFood", icon: "👨‍🍳", completed: progress > 40 },
    { name: "On the\nWay", icon: "🚗", completed: progress > 60 },
    { name: "Arriving\nSoon", icon: "📍", completed: progress > 80 },
  ]

  const driver = {
    name: "John Cooper",
    rating: 4.8,
    reviews: 342,
    vehicle: "Honda Civic - ABC 1234",
    phone: "+1 (555) 123-4567",
    avatar: "J",
  }

  const getStatusMessage = () => {
    if (progress < 20) return "Looking for driver..."
    if (progress < 40) return "Restaurant is preparing your food"
    if (progress < 60) return "Driver is on the way"
    if (progress < 80) return "Driver is arriving soon"
    return "Order delivered!"
  }

  return (
    <div className="animate-slide-in-up pb-20 flex flex-col min-h-screen">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Order Status</h1>
        <p className="text-sm text-white/80 text-center mt-1">Order #12345</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Status Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle size={40} className="text-white" />
          </div>
          <p className="text-center text-sm text-muted-foreground">Order confirmed</p>
        </div>

        {/* Status Message */}
        <h2 className="text-2xl font-bold mb-2 text-center">{getStatusMessage()}</h2>

        {/* Progress Steps */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all font-bold ${
                    step.completed ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-xs text-center text-muted-foreground whitespace-pre-line text-balance">
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full gradient-cyan-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Estimated Time */}
        {progress < 100 && (
          <div className="bg-cyan-50 rounded-lg p-4 w-full mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-primary" />
              <span className="font-bold">Estimated Delivery</span>
            </div>
            <p className="text-sm text-muted-foreground">Arrives in 15-20 minutes</p>
          </div>
        )}

        {/* Driver Info */}
        {progress > 20 && (
          <div className="bg-white border border-border rounded-lg p-4 w-full mb-6">
            <h3 className="font-bold mb-3">Your Driver</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {driver.avatar}
              </div>
              <div className="flex-1">
                <p className="font-bold">{driver.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">⭐ {driver.rating}</span>
                  <span className="text-xs text-muted-foreground">({driver.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{driver.vehicle}</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-cyan-100 text-cyan-700 py-2 rounded-lg font-medium text-sm hover:bg-cyan-200 transition-colors">
                <Phone size={16} />
                Call
              </button>
              <button
                onClick={() => onNavigate("chat")}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-colors"
              >
                <MessageSquare size={16} />
                Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="p-4 space-y-3">
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
