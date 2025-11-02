import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), restaurants(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { restaurantId, items, deliveryAddress, total, paymentMethod } = await request.json()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        restaurant_id: restaurantId,
        delivery_address: deliveryAddress,
        total,
        payment_method: paymentMethod,
        status: "pending",
      })
      .select()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order[0].id,
      food_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      selected_options: item.selectedOptions,
      special_instructions: item.specialInstructions,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json(order[0])
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
