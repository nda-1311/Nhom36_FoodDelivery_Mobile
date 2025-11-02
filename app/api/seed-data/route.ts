import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert sample restaurants
    const { data: restaurants, error: restaurantError } = await supabase
      .from("restaurants")
      .insert([
        {
          name: "Hana Chicken",
          cuisine: "Fried Chicken",
          description: "Crispy fried chicken and delicious sides",
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Category%20Details%20-%20Food%20Listing-z8dE63c7ZnLkJRZ6sYtdwkKRtQFOZw.png",
          delivery_time: 15,
          rating: 4.8,
          review_count: 289,
          is_open: true,
          tags: ["Freeship", "Near you"],
        },
        {
          name: "Bamsu Restaurant",
          cuisine: "Chicken Salad, Sandwich & Desserts",
          description: "Fresh and healthy options",
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Category%20Details%20-%20Food%20Listing-z8dE63c7ZnLkJRZ6sYtdwkKRtQFOZw.png",
          delivery_time: 35,
          rating: 4.1,
          review_count: 156,
          is_open: true,
          tags: ["Freeship"],
        },
        {
          name: "Neighbor Milk",
          cuisine: "Dairy Drinks & Smoothies",
          description: "Refreshing beverages",
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Category%20Details%20-%20Food%20Listing-z8dE63c7ZnLkJRZ6sYtdwkKRtQFOZw.png",
          delivery_time: 35,
          rating: 4.1,
          review_count: 98,
          is_open: true,
          tags: ["Freeship"],
        },
      ])
      .select()

    if (restaurantError) {
      console.error("[v0] Restaurant insert error:", restaurantError)
      return NextResponse.json({ error: "Failed to seed restaurants" }, { status: 500 })
    }

    // Insert sample food items
    if (restaurants && restaurants.length > 0) {
      const restaurantId = restaurants[0].id

      const { error: foodError } = await supabase.from("food_items").insert([
        {
          restaurant_id: restaurantId,
          name: "Fried Chicken",
          description: "Crispy fried wings, thigh",
          category: "Fastfood",
          collection: "Popular",
          price: 15,
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Food%20Details-Ju8srZN2PfV3K7rG99vi6SIqfq4Vzc.png",
          rating: 4.5,
          review_count: 99,
          is_available: true,
        },
        {
          restaurant_id: restaurantId,
          name: "Chicken Salad",
          description: "Fresh chicken with vegetables",
          category: "Healthy",
          collection: "Popular",
          price: 15,
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Category%20Details%20-%20Food%20Listing-z8dE63c7ZnLkJRZ6sYtdwkKRtQFOZw.png",
          rating: 4.5,
          review_count: 99,
          is_available: true,
        },
        {
          restaurant_id: restaurantId,
          name: "Spicy Chicken",
          description: "Hot and spicy fried chicken",
          category: "Fastfood",
          collection: "Deal $1",
          price: 15,
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Category%20Details%20-%20Food%20Listing-z8dE63c7ZnLkJRZ6sYtdwkKRtQFOZw.png",
          rating: 4.5,
          review_count: 99,
          is_available: true,
        },
        {
          restaurant_id: restaurantId,
          name: "Fried Potatoes",
          description: "Golden crispy fries",
          category: "Fastfood",
          collection: "Popular",
          price: 15,
          image_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Category%20Details%20-%20Food%20Listing-z8dE63c7ZnLkJRZ6sYtdwkKRtQFOZw.png",
          rating: 4.5,
          review_count: 99,
          is_available: true,
        },
      ])

      if (foodError) {
        console.error("[v0] Food insert error:", foodError)
        return NextResponse.json({ error: "Failed to seed food items" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded with sample data",
    })
  } catch (error) {
    console.error("[v0] Seed data error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
