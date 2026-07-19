'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, Edit, ExternalLink } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).catch(() => setArticles([])).then((d: any) => {
      if (Array.isArray(d)) setArticles(d);
    });
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {articles.length} 篇文章</p>
        </div>
        <Link href="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> 写文章
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {articles.length > 0 ? (
          <div className="divide-y">
            {articles.map((a: any, i: number) => (
              <div key={a.id || i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="font-medium truncate">{a.title || '无标题'}</div>
                  <div className="flex items-center gap-3 mt-1">
                    {a.category?.name && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{a.category.name}</span>
                    )}
                    {a.publishedAt && (
                      <span className="text-xs text-muted-foreground">{a.publishedAt}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={'/article/' + a.id} target="_blank"
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={'/admin/articles/' + a.id}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Edit className="h-3.5 w-3.5" /> 编辑
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mb-3 opacity-30" />
            <p className="mb-4">暂无文章</p>
            <Link href="/admin/articles/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> 写第一篇
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
