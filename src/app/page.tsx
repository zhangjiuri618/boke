import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { mockArticles, categories } from '@/lib/mock-data';
import Banner from '@/components/Banner';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = { title: 'zhangxu的博客' };

export default function HomePage() {
  return (
    <div className="container py-6 md:py-8">
      <Banner />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最新文章</h2>
              <Link href="/search?q=" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                查看更多
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">分类浏览</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.filter(c => c.slug).map((category) => (
                <Link
                  key={category.id}
                  href={'/category/' + category.slug}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Layers className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-xs text-gray-400">{category.count} 篇</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
