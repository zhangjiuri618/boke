﻿'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";

interface RealArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  views: number;
  publishedAt: string;
  author: { id: string; name: string } | null;
  category: { id: string; name: string; slug: string };
  tags: { tag: { name: string } }[];
}

interface MockArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: { id: string; name: string; slug: string };
  tags: string[];
  author: string;
  publishedAt: string;
  views: number;
}

type Article = RealArticle | MockArticle;

interface ArticleCardProps {
  article: Article;
  index?: number;
}

const categoryColors: Record<string, string> = {
  "AI资讯": "bg-gradient-to-r from-purple-500 to-pink-500",
  "NAS教程": "bg-gradient-to-r from-orange-500 to-red-500",
  "软件教程": "bg-gradient-to-r from-teal-500 to-green-500",
  "工具导航": "bg-gradient-to-r from-blue-500 to-cyan-500",
  "资源分享": "bg-gradient-to-r from-yellow-500 to-orange-500",
};

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const [views, setViews] = useState(article.views);
  const categoryColor = categoryColors[article.category.name] || "bg-gradient-to-r from-gray-400 to-gray-500";
  const authorName = typeof article.author === 'string' ? article.author : article.author?.name || '匿名作者';
  const publishedAt = typeof article.publishedAt === 'string' && article.publishedAt.includes('T')
    ? new Date(article.publishedAt).toLocaleDateString('zh-CN')
    : article.publishedAt;

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('view_count_' + article.id) || '0', 10);
    if (stored > 0) {
      setViews(stored);
    }
  }, [article.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/article/${article.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center rounded-full ${categoryColor} text-white px-2.5 py-0.5 text-xs font-medium shadow-sm`}>
                {article.category.name}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {article.title}
            </h2>

            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {article.summary}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {views.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-400">{authorName}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
