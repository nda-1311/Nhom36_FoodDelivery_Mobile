"use client"

import { ChevronLeft, MapPin, Clock, Wallet } from "lucide-react"
import { useState } from "react"

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const [step, setStep] = useState(1)
  const [selectedOffer, setSelectedOffer] = useState("10%")
  const [selectedPayment, setSelectedPayment] = useState("ewallet")
  const [selectedAddress, setSelectedAddress] = useState("home")

  const offers = [
    { id: "10%", name: "- 10%", description: "Discount on all orders", icon: "📦", discount: 3.2 },
    { id: "shipping", name: "-$1 shipping fee", description: "Free delivery", icon: "🚚", discount: 2.5 },
    { id: "ewallet", name: "-10% for E-wallet", description: "E-wallet payment", icon: "💳", discount: 3.08 },
  ]

  const addresses = [
    { id: "home", label: "Home", address: "201 Katlian No.21 Street", default: true },
    { id: "work", label: "Work", address: "456 Business Ave, Suite 100", default: false },
  ]

  const paymentMethods = [
    { id: "ewallet", name: "E-wallet", icon: "💳", description: "Fast and secure" },
    { id: "card", name: "Credit Card", icon: "🏦", description: "Visa, Mastercard" },
    { id: "cash", name: "Cash on Delivery", icon: "💵", description: "Pay when delivered" },
  ]

  const subtotal = 42
  const deliveryFee = 2.5
  const selectedOfferData = offers.find((o) => o.id === selectedOffer)
  const promotion = -selectedOfferData?.discount || 0
  const total = subtotal + deliveryFee + promotion

  if (step === 1) {
    return (
      <div className="animate-slide-in-up pb-20">
        {/* Header */}
        <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold">Select Offer</h1>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Add or search for voucher"
            className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Offers */}
        <div className="p-4 space-y-3">
          {offers.map((offer) => (
            <button
              key={offer.id}
              onClick={() => setSelectedOffer(offer.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedOffer === offer.id ? "border-primary bg-cyan-50" : "border-border hover:border-primary/50"
              } cursor-pointer`}
            >
              <span className="text-2xl">{offer.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-bold">{offer.name}</p>
                <p className="text-xs text-muted-foreground">{offer.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedOffer === offer.id ? "border-primary bg-primary" : "border-gray-300"
                }`}
              >
                {selectedOffer === offer.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>

        {/* Use Now Button */}
        <div className="p-4">
          <button
            onClick={() => setStep(2)}
            className="w-full gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-slide-in-up pb-20">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => setStep(1)} className="hover:opacity-80">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Order Review</h1>
      </div>

      {/* Delivery Address */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} className="text-primary" />
          <h3 className="font-bold">Delivery Address</h3>
        </div>
        <div className="space-y-2">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => setSelectedAddress(addr.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selectedAddress === addr.id ? "border-primary bg-cyan-50" : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">{addr.label}</p>
              <p className="text-xs text-muted-foreground">{addr.address}</p>
            </button>
          ))}
        </div>
        <button className="text-primary text-sm font-medium mt-3">+ Add new address</button>
      </div>

      {/* Delivery Time */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={20} className="text-primary" />
          <h3 className="font-bold">Delivery Time</h3>
        </div>
        <div className="bg-cyan-50 rounded-lg p-3">
          <p className="text-sm font-medium">Estimated delivery: 20 mins</p>
          <p className="text-xs text-muted-foreground">Arrives by 7:45 PM</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Order Details</h3>
          <button className="text-primary text-sm font-medium">Edit</button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Fried Chicken", size: "L", toppings: "Corn, Cheese Cheddar", spiciness: "Hot", price: 32 },
            { name: "Chicken Salad", size: "M", toppings: "Roasted Sesame", spiciness: "No", price: 10 },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <img src="/diverse-food-spread.png" alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                <p className="text-xs text-muted-foreground">Topping: {item.toppings}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm">${item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={20} className="text-primary" />
          <h3 className="font-bold">Payment Method</h3>
        </div>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                selectedPayment === method.id ? "border-primary bg-cyan-50" : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-xl">{method.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{method.name}</p>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                  selectedPayment === method.id ? "border-primary bg-primary" : "border-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-green-600">
          <span>Promotion ({selectedOfferData?.name})</span>
          <span className="font-medium">${promotion.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Order Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate("order-tracking")}
          className="w-full gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
