import { useState, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  Loader2,
  FileText,
  ChevronRight,
  FlaskConical,
  Table2,
  ImagePlus,
} from "lucide-react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import type { ImpactLabsArticle } from "@shared/schema";

// Register Quill's built-in table module and its formats
const TableModule = Quill.import("modules/table") as any;
TableModule.register();

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "link",
  "image",
  "blockquote",
  "code-block",
  "align",
  "color",
  "indent",
  "table",
  "table-row",
  "table-body",
  "table-container",
];

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pw: string) => {
      await apiRequest("POST", "/api/impact-labs/auth", { password: pw });
    },
    onSuccess: () => {
      toast({ title: "Authenticated successfully" });
      onLogin();
    },
    onError: () => {
      toast({ title: "Invalid password", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <FlaskConical className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-1">Impact Labs</h1>
          <p className="text-sm text-gray-400">Sign in to manage articles</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate(password);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <Input
                type="password"
                placeholder="Enter team password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium"
              disabled={loginMutation.isPending || !password}
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ArticleEditor({
  article,
  onBack,
}: {
  article?: ImpactLabsArticle;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(article?.title || "");
  const [authorName, setAuthorName] = useState(article?.authorName || "");
  const [category, setCategory] = useState(article?.category || "report");
  const [summary, setSummary] = useState(article?.summary || "");
  const [content, setContent] = useState(article?.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl || "");
  const [tags, setTags] = useState(article?.tags?.join(", ") || "");
  const [uploading, setUploading] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const quillRef = useRef<ReactQuill>(null);

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await apiRequest("POST", "/api/impact-labs/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/impact-labs/articles/all"] });
      toast({ title: "Article created successfully" });
      onBack();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create article", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await apiRequest("PATCH", `/api/impact-labs/articles/${article!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/impact-labs/articles/all"] });
      toast({ title: "Article updated successfully" });
      onBack();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update article", description: err.message, variant: "destructive" });
    },
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/impact-labs/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCoverImageUrl(data.url);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const inlineImageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("/api/impact-labs/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        const quill = (quillRef.current as any)?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.url);
          quill.setSelection(range.index + 1, 0);
        }
        toast({ title: "Image inserted" });
      } catch {
        toast({ title: "Image upload failed", variant: "destructive" });
      }
    };
  }, [toast]);

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["blockquote", "code-block"],
        [{ align: [] }],
        [{ color: [] }],
        ["clean"],
      ],
      handlers: {
        image: inlineImageHandler,
      },
    },
    table: true,
  }), [inlineImageHandler]);

  const insertTable = useCallback(() => {
    const quill = (quillRef.current as any)?.getEditor();
    if (!quill) return;
    const tableModule = quill.getModule("table");
    if (!tableModule) return;
    tableModule.insertTable(tableRows, tableCols);
    setShowTablePicker(false);
  }, [tableCols, tableRows]);

  const handleSubmit = (isPublished: boolean) => {
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanedContent = content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

    const data = {
      title,
      slug: generateSlug(title),
      summary,
      content: cleanedContent,
      coverImageUrl: coverImageUrl || null,
      authorName,
      category,
      tags: parsedTags,
      isPublished,
    };

    if (article) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button onClick={onBack} className="hover:text-gray-900 transition-colors">Articles</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium">{article ? "Edit" : "New article"}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
              className="text-base"
            />
            {title && (
              <p className="text-xs text-gray-400 mt-1.5 font-mono">
                /{generateSlug(title)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Summary</label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief description for previews and search results"
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTablePicker((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-400 transition-colors bg-white"
                >
                  <Table2 className="w-3.5 h-3.5" />
                  Insert table
                </button>
                {showTablePicker && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-56">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Table dimensions</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Rows</label>
                        <input
                          type="number"
                          min={2}
                          max={20}
                          value={tableRows}
                          onChange={(e) => setTableRows(Math.max(2, Math.min(20, parseInt(e.target.value) || 2)))}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Columns</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={tableCols}
                          onChange={(e) => setTableCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-center gap-1">
                      {Array.from({ length: Math.min(tableCols, 5) }).map((_, ci) => (
                        <div key={ci} className="flex flex-col gap-1">
                          {Array.from({ length: Math.min(tableRows, 4) }).map((_, ri) => (
                            <div
                              key={ri}
                              className={`w-5 h-3.5 rounded-sm border ${ri === 0 ? "bg-gray-300 border-gray-400" : "bg-white border-gray-200"}`}
                            />
                          ))}
                        </div>
                      ))}
                      {tableCols > 5 && <span className="text-xs text-gray-400">+{tableCols - 5}</span>}
                    </div>
                    <button
                      onClick={insertTable}
                      className="w-full bg-gray-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Insert {tableRows}×{tableCols} table
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <style>{`
                .ql-editor table { border-collapse: collapse; width: 100%; margin: 8px 0; }
                .ql-editor td { border: 1px solid #cbd5e1; padding: 6px 10px; min-width: 60px; min-height: 24px; }
                .ql-editor table tr:first-child td { background: #f8fafc; font-weight: 600; }
              `}</style>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Start writing your article..."
                className="min-h-[400px]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <ImagePlus className="w-3 h-3" />
              Use the image button in the toolbar to upload inline images directly from your device
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Details</h3>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Author</label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="solar, energy, impact"
                className="text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Cover Image</h3>
            {coverImageUrl && (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="w-full h-36 object-cover"
                />
                <button
                  onClick={() => setCoverImageUrl("")}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 transition-colors"
                >
                  &times;
                </button>
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="cover-upload"
              />
              <Button
                variant="outline"
                className="w-full text-sm"
                disabled={uploading}
                onClick={() => document.getElementById("cover-upload")?.click()}
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                ) : (
                  <Upload className="w-3.5 h-3.5 mr-2" />
                )}
                {uploading ? "Uploading..." : coverImageUrl ? "Replace image" : "Upload image"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => handleSubmit(true)}
              disabled={isPending || !title || !authorName || !summary || !content}
              className="w-full bg-gray-900 hover:bg-gray-800 text-sm font-medium"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
              {article?.isPublished ? "Update" : "Publish"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={isPending || !title || !authorName || !summary || !content}
              className="w-full text-sm"
            >
              Save as draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleList({
  onEdit,
  onNew,
}: {
  onEdit: (article: ImpactLabsArticle) => void;
  onNew: () => void;
}) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  const { data: articles = [], isLoading } = useQuery<ImpactLabsArticle[]>({
    queryKey: ["/api/impact-labs/articles/all"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/impact-labs/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/impact-labs/articles/all"] });
      toast({ title: "Article deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete", variant: "destructive" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      await apiRequest("PATCH", `/api/impact-labs/articles/${id}`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/impact-labs/articles/all"] });
      toast({ title: "Article updated" });
    },
    onError: () => {
      toast({ title: "Failed to update", variant: "destructive" });
    },
  });

  const filtered = articles.filter((a) => {
    if (filter === "published") return a.isPublished;
    if (filter === "drafts") return !a.isPublished;
    return true;
  });

  const publishedCount = articles.filter((a) => a.isPublished).length;
  const draftCount = articles.filter((a) => !a.isPublished).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {articles.length} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <Button onClick={onNew} className="bg-gray-900 hover:bg-gray-800 text-sm font-medium">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New article
        </Button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg w-fit">
        {(["all", "published", "drafts"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all capitalize ${
              filter === f
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No articles found</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50/50 transition-colors group"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2.5 mb-1">
                  <h3
                    className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-green-800 transition-colors"
                    onClick={() => onEdit(article)}
                  >
                    {article.title}
                  </h3>
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      article.isPublished
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {article.isPublished ? "Live" : "Draft"}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {article.authorName} &middot;{" "}
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    togglePublishMutation.mutate({
                      id: article.id,
                      isPublished: !article.isPublished,
                    })
                  }
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title={article.isPublished ? "Unpublish" : "Publish"}
                >
                  {article.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onEdit(article)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this article?")) {
                      deleteMutation.mutate(article.id);
                    }
                  }}
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ImpactLabsDashboard() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingArticle, setEditingArticle] = useState<ImpactLabsArticle | undefined>();
  const { toast } = useToast();

  const authQuery = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/impact-labs/auth/check"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/impact-labs/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/impact-labs/auth/check"] });
      toast({ title: "Logged out" });
    },
  });

  const isAuthenticated = authQuery.data?.authenticated === true;

  if (authQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/impact-labs/auth/check"] });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Impact Labs</span>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view === "list" ? (
          <ArticleList
            onEdit={(article) => {
              setEditingArticle(article);
              setView("editor");
            }}
            onNew={() => {
              setEditingArticle(undefined);
              setView("editor");
            }}
          />
        ) : (
          <ArticleEditor
            article={editingArticle}
            onBack={() => {
              setEditingArticle(undefined);
              setView("list");
            }}
          />
        )}
      </main>
    </div>
  );
}
