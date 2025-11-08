"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutPageProps {
  onNavigate: (pageName: string, data?: any) => void;
}

export default function LogoutPage({ onNavigate }: LogoutPageProps) {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("❌ Lỗi khi đăng xuất: " + error.message);
    } else {
      alert("✅ Đăng xuất thành công!");
      router.push("/login");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-red-100 via-orange-100 to-yellow-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <LogOut className="mx-auto w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Bạn có chắc chắn muốn đăng xuất?
        </h2>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => router.back()}
            className="px-5 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
