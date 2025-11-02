"use client";

import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true, // ✅ Giữ đăng nhập sau khi reload
      autoRefreshToken: true, // ✅ Tự refresh token khi gần hết hạn
      detectSessionInUrl: true, // ✅ Lấy session từ URL (sau login OAuth)
      storageKey: "food_delivery.auth", // ✅ Key riêng cho project này
    },
  }
);
