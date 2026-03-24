import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation, Link } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Tag,
  BookOpen,
  FileText,
  Search,
  FlaskConical,
  Briefcase,
  Clock,
} from "lucide-react";
import DOMPurify from "dompurify";
import type { ImpactLabsArticle } from "@shared/schema";

const categories = [
  { value: "all", label: "All", icon: BookOpen },
  { value: "report", label: "Reports", icon: FileText },
  { value: "article", label: "Articles", icon: BookOpen },
  { value: "research", label: "Research", icon: FlaskConical },
  { value: "case-study", label: "Case Studies", icon: Briefcase },
];

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ArticleCard({ article, index }: { article: ImpactLabsArticle; index: number }) {
  const [, setLocation] = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="group cursor-pointer h-full rounded-xl overflow-hidden bg-white border border-gray-100 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 hover:-translate-y-1"
        onClick={() => setLocation(`/impact-labs/${article.slug}`)}
      >
        <div className="relative h-52 overflow-hidden">
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900 items-center justify-center ${article.coverImageUrl ? 'hidden' : 'flex'}`}>
            <FlaskConical className="w-10 h-10 text-white/30" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-medium text-white/90 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full capitalize">
              {article.category}
            </span>
            <span className="text-xs text-white/80 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {estimateReadTime(article.content)} min
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-800 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{article.summary}</p>
          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
            <span className="font-medium text-gray-600">{article.authorName}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-white border border-gray-100">
          <Skeleton className="h-52 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleViewSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-[420px] w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-4/5" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="space-y-4 pt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function ArticleView({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();
  const [imageError, setImageError] = useState(false);

  const { data: article, isLoading, error } = useQuery<ImpactLabsArticle>({
    queryKey: [`/api/impact-labs/articles/${slug}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <ArticleViewSkeleton />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto text-center py-24">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h2>
          <p className="text-gray-500 mb-8 text-sm">This article may have been removed or the link is incorrect.</p>
          <Button
            onClick={() => setLocation("/impact-labs")}
            variant="outline"
            className="text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to all articles
          </Button>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(article.content);

  return (
    <div className="min-h-screen bg-white">
      {article.coverImageUrl && !imageError && (
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-slate-900">
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover opacity-80"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => setLocation("/impact-labs")}
              className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to articles
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-green-400 bg-green-400/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span className="font-medium text-white/90">{article.authorName}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{formatDate(article.publishedAt)}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(!article.coverImageUrl || imageError) && (
        <div className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
          <div className="container mx-auto px-6">
            <button
              onClick={() => setLocation("/impact-labs")}
              className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors group mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to articles
            </button>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-green-400 mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span className="font-medium text-white/90">{article.authorName}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{formatDate(article.publishedAt)}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {article.summary && (
            <p className="text-xl text-gray-600 leading-[1.8] mt-10 mb-8 border-l-4 border-green-500 pl-6">
              {article.summary}
            </p>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-10">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')) }}
            />
          </div>

          <footer className="mt-16 mb-16 pt-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                  {article.authorName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{article.authorName}</p>
                  <p className="text-sm text-gray-500">Published {formatDate(article.publishedAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setLocation("/impact-labs")}
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 transition-colors group bg-green-50 hover:bg-green-100 px-5 py-2.5 rounded-full"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                More articles
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ArticleList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeroVisible(true);
      },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const { data: articles, isLoading } = useQuery<ImpactLabsArticle[]>({
    queryKey: ["/api/impact-labs/articles"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const filteredArticles = articles?.filter(
    (a) => activeCategory === "all" || a.category === activeCategory
  );

  return (
    <>
      <div
        ref={heroRef}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-400/5 to-transparent rounded-full" />
        </div>

        <div
          className="container mx-auto px-6 relative z-10 transition-all duration-1000"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="max-w-2xl">
            <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
              Research & Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
              Impact Labs
            </h1>
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              Research, reports, and stories documenting our environmental and economic impact across Pakistan.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-14">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <ArticleListSkeleton />
        ) : !filteredArticles || filteredArticles.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {activeCategory === "all"
                ? "New research and reports will appear here as they are published."
                : `No ${categories.find((c) => c.value === activeCategory)?.label.toLowerCase()} have been published yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function ImpactLabsPublic() {
  const [match, params] = useRoute("/impact-labs/:slug");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        {match && params?.slug ? (
          <ArticleView slug={params.slug} />
        ) : (
          <ArticleList />
        )}
      </div>
      <Footer />

      <style>{`
        .article-content {
          font-size: 1.2rem;
          line-height: 2;
          color: #1f2937;
          font-feature-settings: "kern" 1, "liga" 1;
          letter-spacing: -0.003em;
          overflow: visible !important;
          max-height: none !important;
          -webkit-line-clamp: unset !important;
          display: block !important;
          overflow-wrap: break-word;
          word-break: normal;
          word-wrap: break-word;
          hyphens: auto;
          -webkit-hyphens: auto;
          -ms-hyphens: auto;
          white-space: normal;
        }
        .article-content * {
          overflow: visible !important;
          max-height: none !important;
          -webkit-line-clamp: unset !important;
          text-overflow: unset !important;
        }
        .article-content > *:first-child {
          margin-top: 0;
        }
        .article-content h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
          line-height: 1.25;
        }
        .article-content h2 {
          font-size: 1.625rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2.75rem;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.3;
          padding-bottom: 0.625rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .article-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 2.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .article-content p {
          margin-bottom: 1.75rem;
          line-height: 2;
          white-space: normal;
          overflow: visible !important;
          overflow-wrap: break-word;
          word-break: normal;
          word-wrap: break-word;
          hyphens: auto;
          -webkit-hyphens: auto;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 2rem;
          padding-left: 1.75rem;
        }
        .article-content ul {
          list-style-type: disc;
        }
        .article-content ol {
          list-style-type: decimal;
        }
        .article-content li {
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
          line-height: 1.9;
        }
        .article-content li::marker {
          color: #10b981;
        }
        .article-content blockquote {
          border-left: 4px solid #10b981;
          padding: 1.5rem 1.75rem;
          margin: 2.5rem 0;
          color: #374151;
          font-style: italic;
          font-size: 1.25rem;
          line-height: 1.8;
          background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          border-radius: 0 0.75rem 0.75rem 0;
        }
        .article-content blockquote p {
          margin-bottom: 0;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2.5rem 0;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }
        .article-content a {
          color: #047857;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 2px;
          text-decoration-color: #a7f3d0;
          transition: all 0.2s;
        }
        .article-content a:hover {
          text-decoration-color: #047857;
          color: #065f46;
        }
        .article-content pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto !important;
          overflow-y: visible !important;
          margin: 2.5rem 0;
          font-size: 0.875rem;
          line-height: 1.7;
          border: 1px solid #1e293b;
        }
        .article-content code {
          background: #f1f5f9;
          padding: 0.2rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.85em;
          color: #334155;
          font-weight: 500;
        }
        .article-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
          font-weight: 400;
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          font-size: 0.9375rem;
          border-radius: 0.75rem;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .article-content th, .article-content td {
          border: 1px solid #e5e7eb;
          padding: 0.875rem 1.25rem;
          text-align: left;
        }
        .article-content th {
          background: #f8fafc;
          font-weight: 600;
          color: #1e293b;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .article-content hr {
          border: none;
          border-top: 2px solid #f3f4f6;
          margin: 3rem 0;
        }
        .article-content strong {
          font-weight: 700;
          color: #111827;
        }
        .article-content em {
          font-style: italic;
          color: #374151;
        }
        .article-content p:last-child {
          margin-bottom: 0;
        }
        .article-content div {
          overflow: visible !important;
          max-height: none !important;
        }
        .article-content span {
          overflow: visible !important;
          display: inline !important;
          -webkit-line-clamp: unset !important;
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
          -webkit-hyphens: auto !important;
        }
      `}</style>
    </div>
  );
}
