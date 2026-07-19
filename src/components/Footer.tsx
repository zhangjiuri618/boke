import Link from 'next/link';

const footerLinks = [
  {
    title: '分类',
    links: [
      { name: 'AI资讯', href: '/category/ai' },
      { name: '软件教程', href: '/category/software' },
      { name: '资讯', href: '/category/news' },
      { name: 'IT工具箱', href: '/category/tools' },
      { name: '搜网盘', href: '/category/pan' },
    ],
  },
  {
    title: '关于',
    links: [
      { name: '关于我们', href: '#' },
      { name: '联系我们', href: '#' },
      { name: '隐私政策', href: '#' },
      { name: '投稿指南', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                玩
              </div>
              <span className="text-xl font-bold">玩客志</span>
            </div>
            <p className="text-sm text-gray-500 mt-3 max-w-xs leading-relaxed">
              探索科技前沿，分享技术干货。专注 AI、软件开发等领域。
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-medium text-sm mb-3 text-gray-900">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 玩客志. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>探索科技前沿</span>
            <span>·</span>
            <Link href="/admin" className="hover:text-gray-900 transition-colors">欢迎到来</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}