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

    // Create tables
    const { error: createError } = await supabase.rpc("exec", {
      sql: `
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          phone TEXT,
          avatar_url TEXT,
          address TEXT,
          rating DECIMAL(3,2) DEFAULT 0,
          total_orders INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create restaurants table
        CREATE TABLE IF NOT EXISTS restaurants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          cuisine TEXT,
          description TEXT,
          image_url TEXT,
          delivery_time INT,
          rating DECIMAL(3,2),
          review_count INT DEFAULT 0,
          is_open BOOLEAN DEFAULT true,
          tags TEXT[],
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create food_items table
        CREATE TABLE IF NOT EXISTS food_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          collection TEXT,
          price DECIMAL(10,2) NOT NULL,
          image_url TEXT,
          rating DECIMAL(3,2),
          review_count INT DEFAULT 0,
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create food_options table
        CREATE TABLE IF NOT EXISTS food_options (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
          option_type TEXT NOT NULL,
          option_name TEXT NOT NULL,
          price_modifier DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Create cart_items table
        CREATE TABLE IF NOT EXISTS cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
          quantity INT NOT NULL DEFAULT 1,
          selected_options JSONB,
          special_instructions TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create orders table
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
          status TEXT DEFAULT 'pending',
          delivery_address TEXT NOT NULL,
          delivery_time INT,
          subtotal DECIMAL(10,2),
          delivery_fee DECIMAL(10,2),
          discount DECIMAL(10,2) DEFAULT 0,
          total DECIMAL(10,2),
          payment_method TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create order_items table
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          food_item_id UUID NOT NULL REFERENCES food_items(id),
          quantity INT NOT NULL,
          price DECIMAL(10,2),
          selected_options JSONB,
          special_instructions TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Create favorites table
        CREATE TABLE IF NOT EXISTS favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id, food_item_id)
        );

        -- Create reviews table
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          rating INT NOT NULL,
          comment TEXT,
          tags TEXT[],
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Create messages table
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          image_url TEXT,
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Create promotions table
        CREATE TABLE IF NOT EXISTS promotions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code TEXT UNIQUE NOT NULL,
          description TEXT,
          discount_type TEXT,
          discount_value DECIMAL(10,2),
          min_order_amount DECIMAL(10,2),
          max_uses INT,
          current_uses INT DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          expires_at TIMESTAMP
        );

        -- Enable Row Level Security
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
        ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
        ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
        ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
      `,
    })

    if (createError) {
      console.error("[v0] Database creation error:", createError)
      return NextResponse.json({ error: "Failed to create tables", details: createError }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database initialized" })
  } catch (error) {
    console.error("[v0] Init DB error:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
