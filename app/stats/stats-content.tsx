"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  MousePointerClick,
  Trophy,
  TrendingUp,
  BarChart3,
  Globe,
} from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  click_count: number;
  position: number;
}

interface StatsContentProps {
  links: Link[];
}

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#14b8a6",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
];

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`;
  } catch {
    return "";
  }
}

interface FaviconProps {
  url: string;
  className?: string;
  size?: number;
}

function Favicon({ url, className = "h-5 w-5", size = 20 }: FaviconProps) {
  const [error, setError] = useState(!url);
  const faviconUrl = getFaviconUrl(url);

  if (error || !faviconUrl) {
    return <Globe className={`${className} text-violet-400`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={faviconUrl}
      alt=""
      width={size}
      height={size}
      className={`${className} object-contain rounded-sm`}
      onError={() => setError(true)}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-card/95 px-4 py-2 shadow-xl backdrop-blur-xl">
        <p className="text-sm font-medium">{payload[0].payload.title}</p>
        <p className="text-xs text-muted-foreground">
          {payload[0].value} 클릭
        </p>
      </div>
    );
  }
  return null;
}

export function StatsContent({ links }: StatsContentProps) {
  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);
  const topLink = [...links].sort(
    (a, b) => (b.click_count || 0) - (a.click_count || 0)
  )[0];
  const linksWithClicks = links.filter((l) => l.click_count > 0);
  const sortedByClicks = [...links].sort(
    (a, b) => (b.click_count || 0) - (a.click_count || 0)
  );
  const maxClicks = sortedByClicks[0]?.click_count || 1;

  // Data for bar chart
  const chartData = linksWithClicks.map((l) => ({
    title: l.title.length > 12 ? l.title.slice(0, 12) + "..." : l.title,
    fullTitle: l.title,
    clicks: l.click_count,
  }));

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute right-1/3 top-80 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            통계
          </span>
        </h1>

        {/* Summary Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {/* Total Clicks */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <MousePointerClick className="h-4 w-4 text-violet-400" />
              총 클릭수
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {totalClicks.toLocaleString()}
            </p>
          </div>

          {/* Top Link */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-yellow-400" />
              인기 링크
            </div>
            {topLink ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Favicon url={topLink.url} className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium truncate">{topLink.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {topLink.click_count} 클릭
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">아직 데이터 없음</p>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              링크별 클릭 비율
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="title"
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="clicks" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Ranking */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            링크별 클릭 순위
          </div>

          {sortedByClicks.length > 0 ? (
            <div className="space-y-4">
              {sortedByClicks.map((link, index) => {
                const barWidth =
                  maxClicks > 0
                    ? ((link.click_count || 0) / maxClicks) * 100
                    : 0;
                return (
                  <div key={link.id} className="flex items-center gap-4">
                    {/* Rank */}
                    <span
                      className={`w-8 text-center text-sm font-bold ${
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                            ? "text-gray-300"
                            : index === 2
                              ? "text-amber-600"
                              : "text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>

                    {/* Favicon */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Favicon url={link.url} className="h-5 w-5" />
                    </div>

                    {/* Title + Bar */}
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-sm font-medium truncate">
                        {link.title}
                      </p>
                      <div className="h-2 w-full rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(barWidth, 2)}%`,
                            background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Click count */}
                    <span className="w-16 text-right text-sm text-muted-foreground">
                      {link.click_count || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              아직 링크가 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
