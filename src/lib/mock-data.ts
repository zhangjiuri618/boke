import { type Article } from "@/lib/types";

// 模拟文章数据
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "GPT-5 发布：AI 能力再次突破，推理能力大幅提升",
    summary: "OpenAI 最新一代模型 GPT-5 正式发布，在推理、多模态理解等方面取得重大突破，性能较上一代提升显著。",
    content: "GPT-5 的发布标志着人工智能进入新纪元...\n\n## 主要改进\n\n1. **推理能力**：在复杂推理任务上提升了 40%\n2. **多模态理解**：支持图像、视频、音频的深度理解\n3. **长上下文**：支持 200K token 上下文窗口\n\n## 应用场景\n\n- 科研辅助\n- 代码生成\n- 内容创作\n\n## 开发者视角\n\n对于开发者来说，GPT-5 带来了更稳定的 API 接口和更低的延迟。",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    category: { id: "1", name: "AI资讯", slug: "ai" },
    tags: ["GPT-5", "OpenAI", "大模型"],
    author: "科技编辑",
    publishedAt: "2026-07-16",
    views: 0,
  },
  {
    id: "2",
    title: "2026 年最佳 NAS 系统推荐：从入门到企业级",
    summary: "全面对比 Synology、QNAP、TrueNAS 等主流 NAS 系统，帮你找到最适合自己的方案。",
    content: "NAS（网络附加存储）已经成为家庭和企业数据管理的核心设备...",
    coverImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    category: { id: "2", name: "NAS教程", slug: "nas" },
    tags: ["NAS", "存储", "家庭服务器"],
    author: "硬件达人",
    publishedAt: "2026-07-15",
    views: 0,
  },
  {
    id: "3",
    title: "Docker 完全入门指南：从安装到部署",
    summary: "一文搞定 Docker 基础概念、安装配置、常用命令和实战部署。",
    content: "Docker 已经成为现代软件开发不可或缺的工具...",
    coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
    category: { id: "3", name: "软件教程", slug: "software" },
    tags: ["Docker", "容器", "DevOps"],
    author: "运维老兵",
    publishedAt: "2026-07-14",
    views: 0,
  },
  {
    id: "4",
    title: "2026 年开发者必备工具导航",
    summary: "精选 50+ 款提升开发效率的工具，涵盖 IDE、调试、部署、监控等环节。",
    content: "好的工具能让开发效率翻倍...",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    category: { id: "4", name: "工具导航", slug: "tools" },
    tags: ["开发工具", "效率", "推荐"],
    author: "效率控",
    publishedAt: "2026-07-13",
    views: 0,
  },
  {
    id: "5",
    title: "免费 ChatGPT 替代方案汇总：2026 新版",
    summary: "盘点 10 款免费可用的 AI 对话工具，覆盖写作、编程、设计等场景。",
    content: "除了 ChatGPT，还有很多优秀的免费 AI 工具...",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    category: { id: "5", name: "资源分享", slug: "resources" },
    tags: ["AI", "免费", "工具推荐"],
    author: "资源猎人",
    publishedAt: "2026-07-12",
    views: 0,
  },
  {
    id: "6",
    title: "Next.js 15 新特性全面解读",
    summary: "Next.js 15 带来了哪些新功能？动态渲染、缓存策略等重大更新一览。",
    content: "Next.js 15 是迄今为止最重要的版本更新...",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    category: { id: "3", name: "软件教程", slug: "software" },
    tags: ["Next.js", "React", "前端"],
    author: "前端工程师",
    publishedAt: "2026-07-11",
    views: 0,
  },
];

export const categories = [
  { id: "1", name: "首页", slug: "", count: 0 },
  { id: "2", name: "AI", slug: "ai", count: 28 },
  { id: "3", name: "软件教程", slug: "software", count: 42 },
  { id: "4", name: "资讯", slug: "news", count: 52 },
  { id: "5", name: "IT工具箱", slug: "tools", count: 19 },
  { id: "6", name: "搜网盘", slug: "pan", count: 12 },
  { id: "7", name: "关于我", slug: "about", count: 8 },
  { id: "8", name: "友文录", slug: "friends", count: 6 },
];

export const hotArticles = [...mockArticles].sort((a, b) => b.views - a.views).slice(0, 5);

export const featuredTopics = [
  {
    id: "1",
    title: "NAS折腾记",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "2",
    title: "AI历险记",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "3",
    title: "App寻梦记",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    color: "from-green-500 to-green-600",
  },
  {
    id: "4",
    title: "AV不是AV",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    color: "from-orange-500 to-orange-600",
  },
];

export const hotComments = [
  {
    id: "1",
    title: "在NAS上使用Dify搭建一个AI助手",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&q=80",
    comments: 15,
    author: "保臻级",
  },
  {
    id: "2",
    title: "Docker部署指南：从零开始搭建你的容器化应用",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=200&q=80",
    comments: 12,
    author: "技术控",
  },
  {
    id: "3",
    title: "2026年最佳开源工具推荐",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80",
    comments: 8,
    author: "效率达人",
  },
];
