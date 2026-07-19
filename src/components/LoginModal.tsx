"use client";
import { useState } from "react";
import { X, LogIn, Eye, EyeOff, UserPlus, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码");
      return;
    }
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      onClose();
      window.location.href = "/admin";
    } else {
      setError("用户名或密码错误");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("请填写完整信息");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError("用户名长度需在3-20个字符之间");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("用户名只能包含字母、数字和下划线");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);
    if (result.success) {
      onClose();
      window.location.href = "/admin";
    } else {
      setError(result.message);
    }
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-blue-400">
            {isLogin ? <LogIn className="h-6 w-6 text-white" /> : <UserPlus className="h-6 w-6 text-white" />}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{isLogin ? "用户登录" : "用户注册"}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? "登录后管理网站内容" : "创建账号开始创作"}
          </p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-700">用户名</label>
            <input type="text" placeholder="请输入用户名" autoFocus
              className="w-full rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          {!isLogin && (
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" placeholder="请输入邮箱地址"
                  className="w-full rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-700">密码</label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} placeholder="请输入密码"
                className="w-full rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">确认密码</label>
              <input type={showPwd ? "text" : "password"} placeholder="请再次输入密码"
                className="w-full rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-sky-300 to-blue-400 text-white py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-sky-400/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? (isLogin ? "登录中..." : "注册中...") : (isLogin ? "登录" : "注册")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isLogin ? "还没有账号？" : "已有账号？"}
          <button onClick={handleSwitch} className="ml-1 text-primary hover:underline font-medium">
            {isLogin ? "立即注册" : "立即登录"}
          </button>
        </p>
      </div>
    </div>
  );
}