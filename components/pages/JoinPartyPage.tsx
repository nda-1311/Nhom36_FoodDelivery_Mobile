"use client"

import { ChevronLeft, Gift, Users, Clock } from "lucide-react"

interface JoinPartyPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function JoinPartyPage({ onNavigate }: JoinPartyPageProps) {
  const partyDeals = [
    {
      id: 1,
      title: "Pizza Party",
      description: "Get 50% off when you order with 3+ friends",
      discount: "50%",
      minPeople: 3,
      image: "/pizza-party.jpg",
      timeLeft: "2 hours",
    },
    {
      id: 2,
      title: "Burger Bash",
      description: "Buy 2 get 1 free on all burgers",
      discount: "33%",
      minPeople: 2,
      image: "/burger-party.jpg",
      timeLeft: "4 hours",
    },
    {
      id: 3,
      title: "Sushi Night",
      description: "Group discount: 40% off for groups of 4+",
      discount: "40%",
      minPeople: 4,
      image: "/sushi-party.jpg",
      timeLeft: "6 hours",
    },
  ]

  return (
    <div className="animate-slide-in-up">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 flex items-center gap-3">
        <button onClick={() => onNavigate("home")} className="hover-lift">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Join Party Deals</h1>
      </div>

      {/* Hero Section */}
      <div className="p-4">
        <div className="gradient-cyan-purple text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Party Deals</h2>
            <p className="text-sm mb-4 opacity-90">Order together with friends and save big!</p>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} />
              <span>Invite friends to unlock exclusive discounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-lg mb-4">How It Works</h3>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-sm">Choose a Party Deal</p>
              <p className="text-xs text-muted-foreground">Select from available group offers</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-sm">Invite Your Friends</p>
              <p className="text-xs text-muted-foreground">Share the party code with friends</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-sm">Order Together</p>
              <p className="text-xs text-muted-foreground">Combine orders and enjoy the discount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deals */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-lg mb-4">Active Party Deals</h3>
        <div className="space-y-4">
          {partyDeals.map((deal) => (
            <div key={deal.id} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img src={deal.image || "/placeholder.svg"} alt={deal.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{deal.title}</h4>
                    <p className="text-sm text-muted-foreground">{deal.description}</p>
                  </div>
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold text-sm">
                    {deal.discount} OFF
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>Min {deal.minPeople} people</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{deal.timeLeft} left</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold text-sm hover-lift">
                  Join This Party
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Active Parties */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-lg mb-4">Your Active Parties</h3>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center gap-3 mb-3">
            <Gift size={20} className="text-primary" />
            <div>
              <p className="font-semibold text-sm">Pizza Party #2024</p>
              <p className="text-xs text-muted-foreground">2 friends joined • 1 more needed</p>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              You
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-300 text-white flex items-center justify-center text-xs font-bold">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-bold">
              +1
            </div>
          </div>
          <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold text-sm hover-lift">
            View Party Details
          </button>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  )
}
