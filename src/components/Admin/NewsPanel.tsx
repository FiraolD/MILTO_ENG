import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check } from "@phosphor-icons/react";
import { articlesApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  type: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const EMPTY_FORM = {
  slug: "",
  title: "",
  content: "",
  excerpt: "",
  author: "",
  category: "",
  is_published: false,
  published_at: null as string | null,
};

const inputCls =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";

export default function NewsPanel() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await articlesApi.list();
      // Only manage news articles here (blog comes later)
      setArticles(((data as ArticleRow[]) ?? []).filter((a) => a.type === "news"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load news articles");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (a: ArticleRow) => {
    setEditingId(a.id);
    setForm({
      slug: a.slug,
      title: a.title,
      content: a.content,
      excerpt: a.excerpt,
      author: a.author,
      category: a.category,
      is_published: a.is_published,
      published_at: a.published_at,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.slug || !form.title) {
      toast.error("Slug and title are required");
      return;
    }
    setSaving(true);
    try {
      // Auto-stamp publish date on first publish
      const payload = {
        ...form,
        type: "news",
        published_at:
          form.published_at ?? (form.is_published ? new Date().toISOString() : null),
      };
      if (editingId) {
        const updated = await articlesApi.update(editingId, payload);
        setArticles((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...updated } : a)));
        toast.success("Article updated");
      } else {
        const created = await articlesApi.create(payload);
        setArticles((prev) => [created as ArticleRow, ...prev]);
        toast.success("Article created");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save article");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await articlesApi.remove(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Article deleted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete article");
    }
  };

  const togglePublish = async (a: ArticleRow) => {
    try {
      const payload = {
        slug: a.slug,
        title: a.title,
        content: a.content,
        excerpt: a.excerpt,
        author: a.author,
        category: a.category,
        type: "news",
        is_published: !a.is_published,
        published_at: a.published_at ?? (!a.is_published ? new Date().toISOString() : null),
      };
      const updated = await articlesApi.update(a.id, payload);
      setArticles((prev) => prev.map((x) => (x.id === a.id ? { ...x, ...updated } : x)));
      toast.success(!a.is_published ? "Article published" : "Article unpublished");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update article");
    }
  };

  if (loading) return <SkeletonRows count={4} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">News</h2>
          <p className="text-sm text-gray-500">Publish news articles shown in the News section</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} /> Add Article
          </button>
        )}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">
              {editingId ? "Edit Article" : "New Article"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Slug *</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="article-slug" />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="Company, Projects, ..." />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Excerpt (short summary)</label>
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className={inputCls} />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Publish Date (optional – auto-set on publish)</label>
              <input
                type="date"
                value={form.published_at ? form.published_at.slice(0, 10) : ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 accent-blue-900" />
              Published (visible on site)
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              <Check size={16} /> {saving ? "Saving..." : editingId ? "Update Article" : "Create Article"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {articles.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500">
            No news articles yet. Publish your first article.
          </div>
        )}
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${a.is_published ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`}>
                    {a.is_published ? "Published" : "Draft"}
                  </span>
                  {a.category && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{a.category}</span>
                  )}
                  {a.published_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(a.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{a.excerpt || a.content}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePublish(a)} className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${a.is_published ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`}>
                  {a.is_published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => openEdit(a)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <PencilSimple size={16} />
                </button>
                <button onClick={() => remove(a.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
