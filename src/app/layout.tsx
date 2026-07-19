import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "TechBlog - 科技资讯博客", template: "%s | TechBlog" },
  description: "探索科技前沿，分享技术干货、AI资讯、NAS教程、软件教程、工具导航、资源分享",
  keywords: ["科技资讯", "AI", "NAS", "教程", "开发工具", "技术博客"],
  openGraph: {
    title: "TechBlog - 科技资讯博客",
    description: "探索科技前沿，分享技术干货",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <BackToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
