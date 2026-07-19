import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-8">
        <div className="text-9xl font-bold bg-gradient-to-b from-primary/20 to-primary/5 bg-clip-text text-transparent select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="h-8 w-8 text-primary/60" />
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2">页面未找到</h1>
      <p className="text-muted-foreground mb-8">您访问的页面不存在或已被移除</p>
      <Link href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
        <Home className="h-4 w-4" /> 返回首页
      </Link>
    </div>
  );
}
