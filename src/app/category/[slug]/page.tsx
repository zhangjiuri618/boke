import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';
import { mockArticles, categories } from '@/lib/mock-data';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: '分类未找到 - 玩客志' };
  return { title: category.name + ' - 玩客志', description: '浏览 ' + category.name + ' 相关文章' };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = mockArticles.filter((a) => a.category.slug === slug);

  return (
    <div className="container py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"><ArrowLeft className="h-4 w-4" /> 返回首页</Link>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><Layers className="h-6 w-6 text-primary" /></div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-sm text-muted-foreground">共 {articles.length} 篇文章</p>
            </div>
          </div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((article, index) => (<ArticleCard key={article.id} article={article} index={index} />))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>该分类暂无文章</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1"><Sidebar /></div>
      </div>
    </div>
  );
}
