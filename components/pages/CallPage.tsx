"use client"

import { Phone, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useState, useEffect } from "react"

interface CallPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function CallPage({ onNavigate }: CallPageProps) {
  const [callTime, setCallTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const driver = {
    name: "John Cooper",
    avatar: "J",
    rating: 4.8,
  }

  return (
    <div className="animate-slide-in-up pb-20 flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Call with Driver</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Driver Info */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in text-white text-3xl font-bold">
            {driver.avatar}
          </div>
          <h2 className="text-2xl font-bold text-center">{driver.name}</h2>
          <p className="text-sm text-muted-foreground text-center mt-1">⭐ {driver.rating}</p>
        </div>

        {/* Call Timer */}
        <div className="text-4xl font-bold text-primary mb-12 font-mono">{formatTime(callTime)}</div>

        {/* Call Controls */}
        <div className="flex gap-6 mb-12">
          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isSpeaker ? "bg-primary text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {isSpeaker ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isMuted ? "bg-primary text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">{isMuted ? "Microphone is muted" : "Microphone is active"}</p>
          <p className="text-sm text-muted-foreground">{isSpeaker ? "Speaker is on" : "Speaker is off"}</p>
        </div>
      </div>

      {/* End Call Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate("order-tracking")}
          className="w-full h-16 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Phone size={24} />
          End Call
        </button>
      </div>
    </div>
  )
}
