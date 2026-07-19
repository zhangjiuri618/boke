'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText, Layers, Tags, Plus, ArrowRight } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({ articles: 0, categories: 0, tags: 0 });
  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()).catch(() => []),
      fetch('/api/categories').then(r => r.json()).catch(() => []),
      fetch('/api/tags').then(r => r.json()).catch(() => []),
    ]).then(([articles, categories, tags]) => {
      setStats({
        articles: Array.isArray(articles) ? articles.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        tags: Array.isArray(tags) ? tags.length : 0,
      });
    });
  }, []);

  const cards = [
    { label: '文章', value: stats.articles, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: '分类', value: stats.categories, icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: '标签', value: stats.tags, icon: Tags, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">管理后台</h1>
        <p className="text-sm text-muted-foreground mt-1">网站内容概览</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border bg-card p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className={cn('rounded-lg p-3', card.bg)}>
                  <Icon className={cn('h-6 w-6', card.color)} />
                </div>
                <div>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="text-sm text-muted-foreground">{card.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href="/admin/articles"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          文章管理 <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
          <Plus className="h-4 w-4" /> 写文章
        </Link>
      </div>
    </div>
  );
}
