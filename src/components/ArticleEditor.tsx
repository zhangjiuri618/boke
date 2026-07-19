"use client";

import { useState, useCallback } from "react";
import { marked } from "marked";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  EyeOff,
  Maximize2,
} from "lucide-react";

interface ArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type ToolbarButton = { icon: React.ComponentType<{ className?: string }>; label: string; action: (text: string) => string } | { type: "divider" };

const toolbarButtons: ToolbarButton[] = [
  { icon: Heading1, label: "H1", action: (text: string) => wrapSelection(text, "# ", "") },
  { icon: Heading2, label: "H2", action: (text: string) => wrapSelection(text, "## ", "") },
  { icon: Heading3, label: "H3", action: (text: string) => wrapSelection(text, "### ", "") },
  { type: "divider" },
  { icon: Bold, label: "粗体", action: (text: string) => wrapSelection(text, "**", "**") },
  { icon: Italic, label: "斜体", action: (text: string) => wrapSelection(text, "*", "*") },
  { icon: Code, label: "行内代码", action: (text: string) => wrapSelection(text, "`", "`") },
  { type: "divider" },
  { icon: List, label: "无序列表", action: (text: string) => prependLines(text, "- ") },
  { icon: ListOrdered, label: "有序列表", action: (text: string) => prependLines(text, "1. ") },
  { icon: Quote, label: "引用", action: (text: string) => prependLines(text, "> ") },
  { type: "divider" },
  { icon: Link, label: "链接", action: (text: string) => insertLink(text) },
  { icon: Image, label: "图片", action: (text: string) => insertImage(text) },
];

function wrapSelection(text: string, before: string, after: string): string {
  if (typeof window === "undefined") return text;
  const textarea = document.querySelector("textarea.article-editor-textarea") as HTMLTextAreaElement;
  if (!textarea) return text;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = text.substring(start, end);
  const replacement = before + selected + (selected ? after : after);

  return text.substring(0, start) + replacement + text.substring(end);
}

function prependLines(text: string, prefix: string): string {
  if (typeof window === "undefined") return text;
  const textarea = document.querySelector("textarea.article-editor-textarea") as HTMLTextAreaElement;
  if (!textarea) return text;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = text.substring(start, end);

  if (!selected) {
    return text.substring(0, start) + prefix + text.substring(end);
  }

  const lines = selected.split("\n");
  const indented = lines.map((line) => prefix + line).join("\n");

  return text.substring(0, start) + indented + text.substring(end);
}

function insertLink(text: string): string {
  if (typeof window === "undefined") return text;
  const textarea = document.querySelector("textarea.article-editor-textarea") as HTMLTextAreaElement;
  if (!textarea) return text;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = text.substring(start, end);

  return text.substring(0, start) + `[${selected || "链接文字"}](https://)` + text.substring(end);
}

function insertImage(text: string): string {
  if (typeof window === "undefined") return text;
  const textarea = document.querySelector("textarea.article-editor-textarea") as HTMLTextAreaElement;
  if (!textarea) return text;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = text.substring(start, end);

  return text.substring(0, start) + `![${selected || "图片描述"}](https://)` + text.substring(end);
}

export default function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleToolbarAction = useCallback((action: (text: string) => string) => {
    onChange(action(value));
    setTimeout(() => {
      const textarea = document.querySelector("textarea.article-editor-textarea") as HTMLTextAreaElement;
      if (textarea) textarea.focus();
    }, 0);
  }, [value, onChange]);

  const wordCount = value.replace(/\s/g, "").length;

  return (
    <div className={`rounded-lg border bg-background transition-all ${fullscreen ? "fixed inset-4 z-50 flex flex-col" : ""}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, idx) =>
            "type" in btn ? (
              <div key={idx} className="w-px h-4 bg-border mx-1" />
            ) : (
              <button
                key={idx}
                onClick={() => handleToolbarAction(btn.action)}
                className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title={btn.label}
              >
                <btn.icon className="h-4 w-4" />
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{wordCount} 字</span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              showPreview ? "bg-primary/10 text-primary" : "hover:bg-accent"
            }`}
          >
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? "编辑" : "预览"}
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 ${showPreview ? "" : "flex"}`}>
        <textarea
          className="article-editor-textarea flex-1 w-full px-4 py-3 text-sm resize-none focus:outline-none bg-transparent"
          placeholder="在此输入 Markdown 内容..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ minHeight: fullscreen ? "calc(100vh - 120px)" : "400px" }}
        />
        {showPreview && (
          <div
            className="flex-1 p-4 text-sm overflow-auto border-l bg-gray-50/50"
            dangerouslySetInnerHTML={{ __html: marked(value) || "<p>预览将在此显示...</p>" }}
            style={{ minHeight: fullscreen ? "calc(100vh - 120px)" : "400px" }}
          />
        )}
      </div>

      <div className="px-3 py-1.5 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground">支持 Markdown 格式</span>
        <span className="text-xs text-muted-foreground">按 Ctrl/Cmd + S 保存</span>
      </div>
    </div>
  );
}
