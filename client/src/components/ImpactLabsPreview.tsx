import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, FileText, FlaskConical } from "lucide-react";
import type { ImpactLabsArticle } from "@shared/schema";

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ImpactLabsPreview() {
  const { data: articles } = useQuery<ImpactLabsArticle[]>({
    queryKey: ["/api/impact-labs/articles"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (!articles || articles.length === 0) return null;

  const latestArticles = articles.slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FlaskConical className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-semibold uppercase tracking-widest text-sm">
              Impact Labs
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Latest Research & Reports
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore our latest findings on environmental impact, community development, and solar energy adoption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {latestArticles.map((article) => (
            <Link key={article.id} href={`/impact-labs/${article.slug}`}>
              <Card className="group h-full cursor-pointer overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-44 overflow-hidden">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-white/60" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white hover:bg-green-700 capitalize text-xs">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
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
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/impact-labs">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              View All Reports
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}