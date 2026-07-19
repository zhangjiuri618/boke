'use client';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2">出错了</h1>
      <p className="text-muted-foreground mb-8 max-w-md">页面加载出现异常，请稍后重试</p>
      <div className="flex gap-3">
        <button onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
          <RefreshCw className="h-4 w-4" /> 重试
        </button>
        <Link href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
          <Home className="h-4 w-4" /> 返回首页
        </Link>
      </div>
    </div>
  );
}
