import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { mockArticles } from '@/lib/mock-data';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: slug.toUpperCase() + ' - 玩客志' };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const articles = mockArticles.filter(a => a.tags.some(t => t.toLowerCase() === slug.toLowerCase()));
  if (articles.length === 0) notFound();
  return (
    <div className="container py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"><ArrowLeft className="h-4 w-4" /> 返回首页</Link>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><Tag className="h-6 w-6 text-primary" /></div>
            <div>
              <h1 className="text-2xl font-bold">#{slug.toUpperCase()}</h1>
              <p className="text-sm text-muted-foreground">共 {articles.length} 篇文章</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((article, index) => (<ArticleCard key={article.id} article={article} index={index} />))}
          </div>
        </div>
        <div className="lg:col-span-1"><Sidebar /></div>
      </div>
    </div>
  );
}
