"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Plus, Menu, X, LogOut, Home, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { name: "概览", href: "/admin", icon: LayoutDashboard },
  { name: "文章管理", href: "/admin/articles", icon: FileText },
  { name: "写文章", href: "/admin/articles/new", icon: Plus },
  { name: "用户管理", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-sm">验证登录...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        "fixed md:sticky top-0 z-50 md:z-0 h-screen w-56 border-r bg-card p-4 flex flex-col transition-transform duration-200",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Admin</Link>
          <button className="md:hidden p-1 text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 flex-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  path === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}
                onClick={() => setSidebarOpen(false)}>
                <Icon className="h-4 w-4" /> {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-muted/50 rounded-lg">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{user.username[0].toUpperCase()}</span>
            </div>
            <span className="text-xs font-medium truncate">{user.username}</span>
          </div>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <LogOut className="h-3.5 w-3.5" /> 退出登录
          </button>
          <Link href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" /> 返回网站
          </Link>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 md:hidden flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1 text-muted-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-bold text-sm bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Admin</span>
          </div>
          <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground">退出</button>
        </div>
        {children}
      </div>
    </div>
  );
}
