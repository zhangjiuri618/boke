# TechBlog

基于 Next.js 15 的技术资讯博客网站。

## 技术栈

- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + MySQL
- Framer Motion

## 本地运行

```bash
npm install
npx prisma generate
npm run dev
```

访问 http://localhost:3000

## 部署

推送到 GitHub 后，在 [Vercel](https://vercel.com) 导入仓库即可自动部署。

需要在 Vercel 控制台设置环境变量：`DATABASE_URL`、`ADMIN_USERNAME`、`ADMIN_PASSWORD`。
