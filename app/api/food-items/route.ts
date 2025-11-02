import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const category = searchParams.get("category")
    const collection = searchParams.get("collection")

    const supabase = await createClient()

    let query = supabase.from("food_items").select("*").eq("is_available", true)

    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId)
    }

    if (category) {
      query = query.eq("category", category)
    }

    if (collection) {
      query = query.eq("collection", collection)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching food items:", error)
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 })
  }
}
