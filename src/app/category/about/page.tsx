import Image from "next/image";
import { Twitter, MapPin, Briefcase, Heart, Mail } from "lucide-react";
import WeChatContact from "@/components/WeChatContact";

export const metadata = { title: '关于我 - 一路向北' };

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white">
          <Image src="/image/logo.png" alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">一路向北</h1>
        <p className="text-gray-500">热爱技术，乐于分享</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-500" />
          关于我
        </h2>
        <div className="space-y-3 text-gray-600 leading-relaxed">
          <p>
            你好！
          </p>
          <p>
            这个博客记录了我在技术道路上的探索与思考。
          </p>
          <p>
            如果你对我的文章感兴趣，欢迎关注我的社交账号，一起交流学习！
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          技能栈
        </h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'Docker', 'MySQL', 'Redis', 'AWS'].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-700 border border-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          联系我
        </h2>
        <div className="space-y-3">
          <WeChatContact />
          <a
            href="mailto:3267059629@qq.com"
            className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <Mail className="w-5 h-5" />
            3267059629@qq.com
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            @wlkz_tech
          </a>
        </div>
      </div>
    </div>
  );
}
