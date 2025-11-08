"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const validate = (): boolean => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    // 🔹 Kiểm tra email
    if (!email) {
      setEmailError("Vui lòng nhập email");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    }

    // 🔹 Kiểm tra mật khẩu
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let message = error.message;
      if (message.includes("Invalid login credentials"))
        message = "Sai email hoặc mật khẩu. Vui lòng thử lại!";
      else if (message.includes("Email not confirmed"))
        message = "Tài khoản chưa được xác minh qua email.";

      setLoginError(message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onNavigate("home");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌄 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=1200&q=80')",
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/70"></div>

      {/* 🌟 Login Card */}
      <div className="relative z-10 w-[90%] max-w-sm bg-white/95 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-3xl text-white shadow-lg mb-3">
            🍱
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            FoodDelivery
          </h1>
          <p className="text-sm text-gray-500">Giao nhanh tận nơi</p>
        </div>

        {/* 🔹 Form */}
        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 bg-white border ${
                emailError ? "border-red-400" : "border-gray-300"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-white border ${
                passwordError ? "border-red-400" : "border-gray-300"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {loginError && (
            <p className="text-red-500 text-sm mt-2 font-medium text-center">
              ❌ {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Chưa có tài khoản?{" "}
          <span
            className="text-cyan-600 cursor-pointer font-medium hover:underline"
            onClick={() => alert("Tính năng đăng ký đang phát triển!")}
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
}
