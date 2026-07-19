"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Home, Brain, BookOpen, Newspaper, Wrench, Cloud, Heart, BookMarked, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/mock-data";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LoginModal from "@/components/LoginModal";

const navIcons: Record<string, any> = {
  "首页": Home,
  "AI": Brain,
  "软件教程": BookOpen,
  "资讯": Newspaper,
  "IT工具箱": Wrench,
  "搜网盘": Cloud,
  "关于我": Heart,
  "友文录": BookMarked,
};

const navColors: Record<string, string> = {
  "首页": "text-blue-500",
  "AI": "text-purple-500",
  "软件教程": "text-teal-500",
  "资讯": "text-red-500",
  "IT工具箱": "text-indigo-500",
  "搜网盘": "text-cyan-500",
  "关于我": "text-rose-500",
  "友文录": "text-amber-500",
};

const navItems = categories.map((c) => ({
  name: c.name,
  href: c.slug ? "/category/" + c.slug : "/",
}));

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const doSearch = (q: string) => {
    if (q.trim()) {
      router.push("/search?q=" + encodeURIComponent(q.trim()));
      setSearchQ("");
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/image/logo.png" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold">一路向北</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0">
            {navItems.map((item) => {
              const Icon = navIcons[item.name] || Home;
              const colorClass = navColors[item.name] || "text-gray-600";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive(item.href) ? "text-primary" : colorClass)} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
              <input
                type="search"
                placeholder="搜索..."
                className="bg-transparent border-none outline-none w-36 focus:w-48 transition-all text-sm focus:outline-none"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch(searchQ)}
              />
            </div>

            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-300 to-blue-400 flex items-center justify-center text-xs text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.username}</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Wrench className="h-4 w-4" /> 管理后台
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Users className="h-4 w-4" /> 退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 px-4 py-1.5 text-sm font-medium hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="hidden sm:inline">登录</span>
                </button>
              )
            )}

            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={cn("md:hidden border-t border-gray-100 transition-all duration-300 overflow-hidden", mobileOpen ? "max-h-[500px]" : "max-h-0")}>
          <div className="container py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = navIcons[item.name] || Home;
              const colorClass = navColors[item.name] || "text-gray-600";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className={cn("h-4 w-4", colorClass)} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100">
              <div className="relative">
                <input
                  type="search"
                  placeholder="搜索文章..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch(searchQ)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}