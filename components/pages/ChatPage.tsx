"use client"

import { ChevronLeft, Phone, Video, Send, MapPin } from "lucide-react"
import { useState } from "react"

interface ChatPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function ChatPage({ onNavigate }: ChatPageProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "driver",
      text: "Hi, I'm on my way to your location. The restaurant is quite busy, so delivery may be 15 mins late.",
      time: "12:03",
      avatar: "J",
    },
    {
      id: 2,
      sender: "user",
      text: "Thank you for letting me know!",
      time: "12:04",
      avatar: "👤",
    },
    {
      id: 3,
      sender: "driver",
      text: "Could you please ask the restaurant to include cutlery? I just need forks and spoons.",
      time: "12:05",
      image: "/cutlery-fork-knife.jpg",
      avatar: "J",
    },
    {
      id: 4,
      sender: "user",
      text: "Yes, let me tell the restaurant right away.",
      time: "12:05",
      avatar: "👤",
    },
    {
      id: 5,
      sender: "driver",
      text: "Great! I'll be there in about 10 minutes.",
      time: "12:06",
      avatar: "J",
    },
  ])

  const [inputValue, setInputValue] = useState("")

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "user",
          text: inputValue,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "👤",
        },
      ])
      setInputValue("")
    }
  }

  const driver = {
    name: "John Cooper",
    rating: 4.8,
    reviews: 342,
    status: "5 mins away",
    avatar: "J",
  }

  return (
    <div className="animate-slide-in-up pb-20 flex flex-col min-h-screen">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate("inbox")} className="hover:opacity-80">
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                {driver.avatar}
              </div>
              <div>
                <h1 className="font-bold">{driver.name}</h1>
                <p className="text-xs text-white/80">{driver.status}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="hover:opacity-80 transition-opacity">
              <Phone size={24} />
            </button>
            <button className="hover:opacity-80 transition-opacity">
              <Video size={24} />
            </button>
          </div>
        </div>

        {/* Driver Rating */}
        <div className="flex items-center gap-2 text-sm">
          <span>⭐ {driver.rating}</span>
          <span className="text-white/80">({driver.reviews} reviews)</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "driver" && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {msg.avatar}
              </div>
            )}
            <div
              className={`max-w-xs ${
                msg.sender === "user"
                  ? "bg-primary text-white rounded-3xl rounded-tr-none"
                  : "bg-gray-100 text-gray-900 rounded-3xl rounded-tl-none"
              } rounded-lg p-3`}
            >
              {msg.image && (
                <img
                  src={msg.image || "/placeholder.svg"}
                  alt="message"
                  className="w-32 h-32 rounded-lg mb-2 object-cover"
                />
              )}
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs opacity-60 mt-1 ${msg.sender === "user" ? "text-white/70" : ""}`}>{msg.time}</p>
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                {msg.avatar}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border bg-white">
        <div className="flex gap-2 mb-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-foreground py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            <MapPin size={16} />
            Share Location
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-foreground py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Call Driver
          </button>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
