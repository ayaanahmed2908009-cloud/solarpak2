import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { ArrowRight, Clock, FlaskConical } from "lucide-react";
import type { ImpactLabsArticle } from "@shared/schema";

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ImpactLabsPreview() {
  const { data: articles } = useQuery<ImpactLabsArticle[]>({
    queryKey: ["/api/impact-labs/articles"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (!articles || articles.length === 0) return null;

  const latestArticles = articles.slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/8 to-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-500/6 to-cyan-500/6 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-3 block">
              Impact Labs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Latest Research
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl leading-relaxed text-sm">
              Impact Labs is where our team publishes in-depth articles, field reports, and data-driven insights on how solar energy is transforming communities across Pakistan.
            </p>
          </div>
          <Link href="/impact-labs">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors group">
              View all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {latestArticles.map((article) => (
            <Link key={article.id} href={`/impact-labs/${article.slug}`}>
              <div className="group h-full rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-300 cursor-pointer">
                <div className="relative h-60 overflow-hidden">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-emerald-900 flex items-center justify-center">
                      <FlaskConical className="w-10 h-10 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/90 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-xs text-white/70 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {estimateReadTime(article.content)} min
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-white mb-3 line-clamp-2 group-hover:text-green-300 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                    <span className="text-gray-400">{article.authorName}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden text-center">
          <Link href="/impact-labs">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              View all articles
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
