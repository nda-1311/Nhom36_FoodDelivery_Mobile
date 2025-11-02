"use client"

import { ChevronLeft, Star, Upload, Check } from "lucide-react"
import { useState } from "react"

interface RatingPageProps {
  onNavigate: (page: string, data?: any) => void
}

export default function RatingPage({ onNavigate }: RatingPageProps) {
  const [foodRating, setFoodRating] = useState(0)
  const [driverRating, setDriverRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [foodFeedback, setFoodFeedback] = useState("")
  const [driverFeedback, setDriverFeedback] = useState("")
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const foodTags = ["Delicious", "Fresh", "Hot", "Well-packaged", "Portion size"]
  const driverTags = ["Friendly", "Professional", "Quick", "Careful", "Contactless"]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      onNavigate("home")
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="animate-slide-in-up pb-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
          <Check size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground text-center mb-6">Your feedback helps us improve</p>
        <p className="text-sm text-muted-foreground">Redirecting to home...</p>
      </div>
    )
  }

  return (
    <div className="animate-slide-in-up pb-20">
      {/* Header */}
      <div className="gradient-cyan-blue text-white p-4 sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => onNavigate("home")} className="hover:opacity-80">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">Rate Your Order</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Food Rating Section */}
        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🍔</span>
            <div>
              <h3 className="font-bold">Rate Your Food</h3>
              <p className="text-xs text-muted-foreground">How was the quality?</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setFoodRating(star)} className="transition-transform hover:scale-110">
                <Star
                  size={32}
                  className={star <= foodRating ? "text-yellow-400" : "text-gray-300"}
                  fill={star <= foodRating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>

          {/* Food Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {foodTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag) ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedTags.includes(tag) && <Check size={14} className="inline mr-1" />}
                {tag}
              </button>
            ))}
          </div>

          {/* Food Feedback */}
          <textarea
            placeholder="Tell us more about your food experience..."
            value={foodFeedback}
            onChange={(e) => setFoodFeedback(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
        </div>

        {/* Driver Rating Section */}
        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              J
            </div>
            <div>
              <h3 className="font-bold">Rate John Cooper</h3>
              <p className="text-xs text-muted-foreground">How was the delivery?</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setDriverRating(star)} className="transition-transform hover:scale-110">
                <Star
                  size={32}
                  className={star <= driverRating ? "text-yellow-400" : "text-gray-300"}
                  fill={star <= driverRating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>

          {/* Driver Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {driverTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag) ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedTags.includes(tag) && <Check size={14} className="inline mr-1" />}
                {tag}
              </button>
            ))}
          </div>

          {/* Driver Feedback */}
          <textarea
            placeholder="Tell us more about your driver experience..."
            value={driverFeedback}
            onChange={(e) => setDriverFeedback(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
        </div>

        {/* Delivery Rating Section */}
        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🚗</span>
            <div>
              <h3 className="font-bold">Rate Delivery Speed</h3>
              <p className="text-xs text-muted-foreground">Was it on time?</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setDeliveryRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={star <= deliveryRating ? "text-yellow-400" : "text-gray-300"}
                  fill={star <= deliveryRating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white border border-border rounded-lg p-4">
          <h3 className="font-bold mb-3">Share a Photo (Optional)</h3>
          <button
            onClick={() => setPhotoUploaded(!photoUploaded)}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed transition-all ${
              photoUploaded
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-cyan-50"
            }`}
          >
            {photoUploaded ? (
              <>
                <Check size={20} className="text-green-600" />
                <span className="text-green-600 font-medium">Photo added</span>
              </>
            ) : (
              <>
                <Upload size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">Click to upload photo</span>
              </>
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={foodRating === 0 || driverRating === 0}
          className="w-full gradient-cyan-blue text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Feedback
        </button>

        <p className="text-xs text-center text-muted-foreground">
          Your feedback is valuable and helps us improve our service
        </p>
      </div>
    </div>
  )
}
