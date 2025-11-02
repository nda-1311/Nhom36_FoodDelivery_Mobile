"use client"

import { ChevronLeft, MessageCircle, Phone } from "lucide-react"

interface InboxPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function InboxPage({ onNavigate }: InboxPageProps) {
  const messages = [
    {
      id: 1,
      name: "John Cooper",
      role: "Food Delivery Driver",
      lastMessage: "I'm on my way! 5 mins away",
      time: "2 mins ago",
      avatar: "J",
      unread: true,
      status: "active",
      orderId: "ORD-2024-001",
    },
    {
      id: 2,
      name: "Bamsu Restaurant",
      role: "Restaurant",
      lastMessage: "Your order is being prepared",
      time: "15 mins ago",
      avatar: "B",
      unread: false,
      status: "online",
      orderId: "ORD-2024-001",
    },
    {
      id: 3,
      name: "Support Team",
      role: "Customer Support",
      lastMessage: "How can we help you today?",
      time: "1 hour ago",
      avatar: "S",
      unread: false,
      status: "online",
      orderId: null,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "Previous Driver",
      lastMessage: "Thanks for the 5-star rating!",
      time: "Yesterday",
      avatar: "S",
      unread: false,
      status: "offline",
      orderId: "ORD-2024-000",
    },
  ]

  return (
    <div className="animate-slide-in-up">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 flex items-center gap-3">
        <button onClick={() => onNavigate("home")} className="hover-lift">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Inbox</h1>
      </div>

      {/* Messages List */}
      <div className="divide-y">
        {messages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => onNavigate("chat", msg)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-all border-b border-border"
          >
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold text-lg">
                  {msg.avatar}
                </div>
                {msg.status === "active" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {msg.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className={`font-semibold text-sm ${msg.unread ? "text-foreground" : "text-muted-foreground"}`}>
                      {msg.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{msg.role}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">{msg.time}</span>
                </div>
                <p
                  className={`text-sm truncate ${msg.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  {msg.lastMessage}
                </p>
                {msg.orderId && <p className="text-xs text-primary mt-1">{msg.orderId}</p>}
              </div>

              {/* Unread Badge */}
              {msg.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 ml-15">
              <button className="flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold hover:bg-cyan-200 transition-all">
                <Phone size={12} />
                Call
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-all">
                <MessageCircle size={12} />
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-8"></div>
    </div>
  )
}
