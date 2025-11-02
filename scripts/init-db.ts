import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initializeDatabase() {
  try {
    console.log("[v0] Starting database initialization...")

    // Create users table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          avatar_url TEXT,
          rating DECIMAL(3,2) DEFAULT 0,
          total_orders INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create restaurants table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS restaurants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          rating DECIMAL(3,2) DEFAULT 0,
          delivery_time INT,
          delivery_fee DECIMAL(10,2),
          min_order DECIMAL(10,2),
          cuisine_type TEXT,
          is_open BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create food_items table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS food_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          restaurant_id UUID REFERENCES restaurants(id),
          name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          price DECIMAL(10,2) NOT NULL,
          category TEXT,
          collection TEXT,
          rating DECIMAL(3,2) DEFAULT 0,
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create food_options table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS food_options (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          food_item_id UUID REFERENCES food_items(id),
          option_type TEXT,
          option_name TEXT,
          price_modifier DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create cart_items table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          food_item_id UUID REFERENCES food_items(id),
          quantity INT NOT NULL,
          special_instructions TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create orders table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          restaurant_id UUID REFERENCES restaurants(id),
          status TEXT DEFAULT 'pending',
          delivery_address TEXT,
          delivery_time INT,
          total_amount DECIMAL(10,2),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create order_items table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id),
          food_item_id UUID REFERENCES food_items(id),
          quantity INT,
          price DECIMAL(10,2),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create favorites table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          food_item_id UUID REFERENCES food_items(id),
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id, food_item_id)
        );
      `,
      })
      .catch(() => {})

    // Create reviews table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id),
          user_id UUID REFERENCES users(id),
          rating INT,
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    // Create messages table
    await supabase
      .rpc("exec", {
        sql: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id),
          sender_id UUID REFERENCES users(id),
          message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      })
      .catch(() => {})

    console.log("[v0] Database tables created successfully")

    // Seed sample data
    await seedData()
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    process.exit(1)
  }
}

async function seedData() {
  try {
    console.log("[v0] Seeding sample data...")

    // Insert sample restaurants
    const { data: restaurants } = await supabase
      .from("restaurants")
      .insert([
        {
          name: "Hana Chicken",
          description: "Crispy fried chicken and delicious sides",
          image_url: "/hana-chicken.jpg",
          rating: 4.8,
          delivery_time: 15,
          delivery_fee: 2,
          min_order: 10,
          cuisine_type: "Fastfood",
          is_open: true,
        },
        {
          name: "Bamsu Restaurant",
          description: "Chicken Salad, Sandwich & Desserts",
          image_url: "/bamsu-restaurant.jpg",
          rating: 4.1,
          delivery_time: 35,
          delivery_fee: 3,
          min_order: 15,
          cuisine_type: "Fastfood",
          is_open: true,
        },
        {
          name: "Neighbor Milk",
          description: "Dairy Drinks & Smoothies",
          image_url: "/neighbor-milk.jpg",
          rating: 4.1,
          delivery_time: 35,
          delivery_fee: 2,
          min_order: 8,
          cuisine_type: "Drink",
          is_open: true,
        },
      ])
      .select()

    console.log("[v0] Sample restaurants created:", restaurants?.length)

    // Insert sample food items
    if (restaurants && restaurants.length > 0) {
      const restaurantId = restaurants[0].id

      await supabase.from("food_items").insert([
        {
          restaurant_id: restaurantId,
          name: "Fried Chicken",
          description: "Crispy fried wings, thigh",
          image_url: "/fried-chicken.jpg",
          price: 15,
          category: "Fastfood",
          collection: "Popular",
          rating: 4.5,
          is_available: true,
        },
        {
          restaurant_id: restaurantId,
          name: "Chicken Salad",
          description: "Fresh chicken with mixed vegetables",
          image_url: "/chicken-salad.jpg",
          price: 12,
          category: "Healthy",
          collection: "Popular",
          rating: 4.3,
          is_available: true,
        },
        {
          restaurant_id: restaurantId,
          name: "Spicy Chicken",
          description: "Hot and spicy fried chicken",
          image_url: "/spicy-chicken.jpg",
          price: 15,
          category: "Fastfood",
          collection: "Deal $1",
          rating: 4.5,
          is_available: true,
        },
        {
          restaurant_id: restaurantId,
          name: "Fried Potatoes",
          description: "Golden crispy fried potatoes",
          image_url: "/fried-potatoes.jpg",
          price: 8,
          category: "Fastfood",
          collection: "Freeship",
          rating: 4.2,
          is_available: true,
        },
      ])
    }

    console.log("[v0] Sample food items created")
    console.log("[v0] Database initialization completed successfully!")
  } catch (error) {
    console.error("[v0] Seeding error:", error)
  }
}

initializeDatabase()
