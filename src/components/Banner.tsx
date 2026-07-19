"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, BookOpen, FolderOpen, Flame, Clock, Calendar, MessageCircle, Mail } from "lucide-react";

const banners = [
  {
    id: "1",
    title: "周杰伦",
    subtitle: "华语乐坛天王",
    image: "/image/周杰伦.png",
    badge: "音乐",
    tag: "歌手",
    views: "10K",
  },
  {
    id: "2",
    title: "Lumen骑士",
    subtitle: "游戏角色展示",
    image: "/image/Lumen骑士.png",
    badge: "游戏",
    tag: "角色",
    views: "8K",
  },
];

interface Stats {
  articleCount: number;
  categoryCount: number;
  viewCount: number;
}

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<Stats>({ articleCount: 0, categoryCount: 0, viewCount: 0 });
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  const copyWeChat = () => {
    navigator.clipboard.writeText('Zx618me');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchStats = () => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          articleCount: data.articleCount || 0,
          categoryCount: data.categoryCount || 0,
          viewCount: data.viewCount || 0,
        });
      })
      .catch(() => {
        setStats({ articleCount: 0, categoryCount: 0, viewCount: 0 });
      });
  };

  useEffect(() => {
    setCurrentTime(new Date());
    fetchStats();
    const statsInterval = setInterval(fetchStats, 30000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + "W";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-4 p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-md flex items-center justify-center mb-4">
              <img src="/image/logo.png" alt="Logo" className="w-16 h-16 object-cover rounded-full" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">一路向北</h3>
            <p className="text-sm text-gray-500 mt-1">探索科技前沿</p>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-3">
              <Clock className="h-3.5 w-3.5" />
              当前时间
            </div>
            <div className="text-center">
              {currentTime ? (
                <>
                  <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{currentTime.getFullYear()}年{currentTime.getMonth() + 1}月{currentTime.getDate()}日</span>
                    <span className="text-gray-300">|</span>
                    <span>{weekDays[currentTime.getDay()]}</span>
                  </div>
                  <p className="text-blue-600 text-2xl font-bold font-mono">
                    {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
                  </p>
                </>
              ) : (
                <p className="text-blue-600 text-2xl font-bold font-mono">--:--:--</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <BookOpen className="h-5 w-5 mx-auto text-blue-500 mb-1.5" />
              <p className="text-xl font-bold text-gray-900">{stats.articleCount}</p>
              <p className="text-xs text-gray-500">文章</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <FolderOpen className="h-5 w-5 mx-auto text-teal-500 mb-1.5" />
              <p className="text-xl font-bold text-gray-900">{stats.categoryCount}</p>
              <p className="text-xs text-gray-500">分类</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <Flame className="h-5 w-5 mx-auto text-amber-500 mb-1.5" />
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.viewCount)}</p>
              <p className="text-xs text-gray-500">访问量</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-3">
            <button onClick={copyWeChat} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              <MessageCircle className="h-3.5 w-3.5" />
              {copied ? '已复制' : '微信：Zx618me'}
            </button>
            <span className="text-gray-300">|</span>
            <a href="mailto:3267059629@qq.com" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors">
              <Mail className="h-3.5 w-3.5" />
              3267059629@qq.com
            </a>
          </div>
        </div>

        <div className="lg:col-span-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative h-64 md:h-80 lg:h-full"
            >
              <img
                src={banners[currentIndex].image}
                alt={banners[currentIndex].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

              <div className="relative z-10 flex h-full items-center px-4 md:px-8 lg:px-12">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white px-3 py-1 text-xs font-medium shadow-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {banners[currentIndex].badge}
                    </span>
                    <span className="text-xs text-white/70">{banners[currentIndex].tag}</span>
                  </div>

                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                    {banners[currentIndex].title}
                  </h1>

                  <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed">
                    {banners[currentIndex].subtitle}
                  </p>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/article/${banners[currentIndex].id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 hover:shadow-lg transition-all"
                    >
                      立即体验
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-white/60">{banners[currentIndex].views} 阅读</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 transition-all shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 transition-all shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-gradient-to-r from-green-400 to-cyan-400"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
