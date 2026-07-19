import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Tag, User } from 'lucide-react';
import { mockArticles } from '@/lib/mock-data';
import ViewTracker from "@/components/ViewTracker";
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = mockArticles.find((a) => a.id === id);
  if (!article) return { title: '文章未找到 - 玩客志' };
  return { title: article.title + ' - 玩客志', description: article.summary };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = mockArticles.find((a) => a.id === id);
  if (!article) notFound();

  const relatedArticles = mockArticles.filter((a) => a.category.id === article.category.id && a.id !== article.id).slice(0, 3);

  return (
    <div className="container py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> 返回首页
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <Link href={'/category/' + article.category.slug}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">{article.category.name}</Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-4 border-b">
            <span className="flex items-center gap-1"><User className="h-4 w-4" />{article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{article.publishedAt}</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /><ViewTracker articleId={article.id} initialViews={article.views} /> 阅读</span>
          </div>
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted mb-8 shadow-md">
            <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
          </div>
          <div className="article-content max-w-none" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
          <div className="flex items-center gap-2 mt-8 pt-6 border-t">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag} href={'/tag/' + tag.toLowerCase()}
                  className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">{tag}</Link>
              ))}
            </div>
          </div>
          {relatedArticles.length > 0 && (
            <section className="mt-10 pt-6 border-t">
              <h2 className="text-lg font-semibold mb-4">相关文章</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={'/article/' + related.id} className="group">
                    <div className="overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img src={related.coverImage} alt={related.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{related.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
