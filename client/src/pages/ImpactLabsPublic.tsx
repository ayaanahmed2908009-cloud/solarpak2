import { useState } from "react";
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
  Calendar,
  User,
  Tag,
  BookOpen,
  FileText,
  Search,
  FlaskConical,
  Briefcase,
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

function ArticleCard({ article }: { article: ImpactLabsArticle }) {
  const [, setLocation] = useLocation();

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300"
      onClick={() => setLocation(`/impact-labs/${article.slug}`)}
    >
      <div className="relative h-48 overflow-hidden">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white/60" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-600 text-white hover:bg-green-700 capitalize">
            {article.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{article.authorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ArticleViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      <Skeleton className="h-8 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-4">
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

  const { data: article, isLoading, error } = useQuery<ImpactLabsArticle>({
    queryKey: [`/api/impact-labs/articles/${slug}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <ArticleViewSkeleton />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => setLocation("/impact-labs")}
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => setLocation("/impact-labs")}
          variant="ghost"
          className="mb-6 text-green-700 hover:text-green-900 hover:bg-green-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>

        {article.coverImageUrl && (
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <Badge className="bg-green-600 text-white hover:bg-green-700 capitalize mb-4">
            {article.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{article.authorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-4 h-4" />
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
          />
        </div>
      </div>
    </div>
  );
}

function ArticleList() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: articles, isLoading } = useQuery<ImpactLabsArticle[]>({
    queryKey: ["/api/impact-labs/articles"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const filteredArticles = articles?.filter(
    (a) => activeCategory === "all" || a.category === activeCategory
  );

  return (
    <>
      <div className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-teal-700 py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskConical className="w-8 h-8 text-green-200" />
            <span className="text-green-200 font-semibold uppercase tracking-widest text-sm">Research Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            SolarPak Impact Labs
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
            Research, Reports & Insights on Our Environmental and Economic Impact
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.value)}
                className={
                  activeCategory === cat.value
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                }
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {isLoading ? (
          <ArticleListSkeleton />
        ) : !filteredArticles || filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Articles Yet</h2>
            <p className="text-gray-600">
              {activeCategory === "all"
                ? "Check back soon for research reports and articles from our Impact Labs."
                : `No ${categories.find((c) => c.value === activeCategory)?.label.toLowerCase()} available yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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
    <div className="min-h-screen bg-gray-50">
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
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }
        .article-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .article-content p {
          margin-bottom: 1.25rem;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .article-content ul {
          list-style-type: disc;
        }
        .article-content ol {
          list-style-type: decimal;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content blockquote {
          border-left: 4px solid #10b981;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background: #f0fdf4;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #065f46;
          font-style: italic;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
        .article-content a {
          color: #059669;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-content a:hover {
          color: #047857;
        }
        .article-content pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }
        .article-content code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .article-content pre code {
          background: transparent;
          padding: 0;
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .article-content th, .article-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          text-align: left;
        }
        .article-content th {
          background: #f9fafb;
          font-weight: 600;
        }
        .article-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}