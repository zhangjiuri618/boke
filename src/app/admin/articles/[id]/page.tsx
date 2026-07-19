'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Upload, Tag } from 'lucide-react';
import Link from 'next/link';
import ArticleEditor from '@/components/ArticleEditor';

interface Props { params: Promise<{ id: string }> }

export default function EditArticle({ params }: Props) {
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ title: '', summary: '', content: '', coverImage: '', categoryId: '' });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).catch(() => []).then(setCats);
    fetch('/api/tags').then(r => r.json()).catch(() => []).then(data => {
      if (Array.isArray(data)) {
        setAllTags(data.map((t: any) => t.name));
      }
    });
    params.then(({ id }) => {
      fetch('/api/articles/' + id).then(r => r.json()).then(d => {
        if (d && d.title) {
          setForm({ title: d.title || '', summary: d.summary || '', content: d.content || '', coverImage: d.coverImage || '', categoryId: d.categoryId || '' });
          if (d.tags) {
            setTags(Array.isArray(d.tags) ? d.tags : (d.tags.split?.(',') || []));
          }
        }
      });
    });
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaved(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        autoSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form]);

  const autoSave = useCallback(() => {
    if (form.title.trim() || form.content.trim()) {
      localStorage.setItem('draft_edit', JSON.stringify(form));
      setSaved(true);
    }
  }, [form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, coverImage: data.url });
      }
    } catch (err) {
      console.error('上传失败:', err);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const submit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const { id } = await params;
      await fetch('/api/admin/articles/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags }),
      });
      localStorage.removeItem('draft_edit');
      router.push('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <Link href="/admin/articles"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回文章管理
      </Link>

      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">标题</label>
            <input placeholder="输入文章标题"
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">分类</label>
              <select
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">选择分类</option>
                {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">封面图</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  value={form.coverImage}
                  onChange={e => setForm({ ...form, coverImage: e.target.value })} />
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium hover:bg-accent cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">上传</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </div>
              {form.coverImage && (
                <img src={form.coverImage} alt="封面预览" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">标签</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="relative">
                <input
                  type="text"
                  placeholder="添加标签..."
                  className="rounded-lg border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  list="tag-suggestions-edit" />
                <datalist id="tag-suggestions-edit">
                  {allTags.map(tag => <option key={tag} value={tag} />)}
                </datalist>
              </div>
            </div>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">摘要</label>
            <textarea placeholder="文章摘要（简短描述文章内容）"
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
              rows={3}
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">文章内容</label>
            <ArticleEditor value={form.content} onChange={content => setForm({ ...form, content })} />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {saved && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  已自动保存
                </span>
              )}
              <button onClick={autoSave} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                手动保存草稿
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={submit} disabled={loading || !form.title.trim()}
                className="rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                {loading ? '保存中...' : '保存'}
              </button>
              <Link href="/admin/articles"
                className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
                取消
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-3">快速指南</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                使用工具栏快速插入标题、粗体等格式
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                按 Ctrl/Cmd + S 手动保存草稿
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                点击预览按钮查看渲染效果
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                支持拖拽或上传封面图片
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-3">Markdown 示例</h3>
            <div className="text-xs text-muted-foreground font-mono space-y-1">
              <p><code className="bg-gray-100 px-1 rounded"># 标题</code></p>
              <p><code className="bg-gray-100 px-1 rounded">**粗体** *斜体*</code></p>
              <p><code className="bg-gray-100 px-1 rounded">- 列表项</code></p>
              <p><code className="bg-gray-100 px-1 rounded">[链接](url)</code></p>
              <p><code className="bg-gray-100 px-1 rounded">![图片](url)</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
