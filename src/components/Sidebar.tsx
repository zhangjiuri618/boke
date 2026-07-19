'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, MessageCircle } from "lucide-react";
import { mockArticles, hotComments } from "@/lib/mock-data";

const allTags = [...new Set(mockArticles.flatMap(a => a.tags))];

const topBadgeColors = ["bg-gradient-to-r from-red-500 to-orange-500", "bg-gradient-to-r from-orange-500 to-yellow-500", "bg-gradient-to-r from-blue-500 to-cyan-500"];

export default function Sidebar() {
  const [hotArticles, setHotArticles] = useState(mockArticles.slice(0, 5));

  useEffect(() => {
    const articlesWithViews = mockArticles.map((article) => {
      const stored = parseInt(localStorage.getItem("view_count_" + article.id) || "0", 10);
      return { ...article, views: stored };
    });
    articlesWithViews.sort((a, b) => b.views - a.views);
    setHotArticles(articlesWithViews.slice(0, 5));
  }, []);

  return (
    <aside className="space-y-6">

      <div className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
          <Flame className="h-4 w-4 text-orange-500" /> 热门阅读
        </h3>
        <div className="space-y-3">
          {hotArticles.map((article, index) => (
            <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-3">
              <span className={`
                text-sm font-bold w-5 h-5 flex items-center justify-center rounded text-white
                ${index < 3 ? topBadgeColors[index] : "bg-gray-200 text-gray-500"}
              `}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <span className="text-xs text-gray-400">{article.views.toLocaleString()} 阅读</span>
              </div>
              {index < 3 && (
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
          <MessageCircle className="h-4 w-4 text-green-500" /> 热门评论
        </h3>
        <div className="space-y-4">
          {hotComments.map((item, index) => (
            <Link key={item.id} href={`/article/${item.id}`} className="group">
              <div className="flex items-start gap-3">
                <span className={`
                  text-sm font-bold w-5 h-5 flex items-center justify-center rounded text-white flex-shrink-0
                  ${index === 0 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gray-200 text-gray-500"}
                `}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {item.comments}
                    </span>
                    <span className="text-xs text-gray-400">{item.author}</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase()}`}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 text-xs text-gray-600 hover:from-primary/20 hover:to-primary/10 hover:text-primary transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}
