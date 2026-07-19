"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function WeChatContact() {
  const [copied, setCopied] = useState(false);

  const copyWeChat = () => {
    navigator.clipboard.writeText('Zx618me');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copyWeChat} className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
      <MessageCircle className="w-5 h-5" />
      {copied ? '已复制' : '微信：Zx618me'}
    </button>
  );
}
