import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("restaurants").select("*").eq("is_open", true)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching restaurants:", error)
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 })
  }
}
