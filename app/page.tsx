"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth";
import { Link2, BarChart3, Globe, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[128px]" />
        <div className="absolute right-1/4 top-1/2 h-96 w-96 rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/2 h-96 w-96 rounded-full bg-cyan-600/15 blur-[128px]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-violet-400" />
          링크 관리의 새로운 시작
        </div>

        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          모든 링크를
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            한 곳에
          </span>
        </h1>

        <p className="mb-10 max-w-lg text-lg text-muted-foreground sm:text-xl">
          나만의 링크 페이지를 만들어 공유하세요.
          <br />
          간편하게 관리하고, 클릭 통계까지 한눈에.
        </p>

        <form action={signInWithGoogle}>
          <Button
            type="submit"
            size="lg"
            className="group gap-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-6 text-lg font-semibold shadow-2xl shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/40"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google로 시작하기
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce text-muted-foreground">
          <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/30">
            <div className="mx-auto mt-1.5 h-2 w-1 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-5xl px-4 pb-32">
        <h2 className="mb-16 text-center text-3xl font-bold sm:text-4xl">
          왜{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            mylink
          </span>
          인가요?
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Feature 1 */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/10">
            <div className="mb-4 inline-flex rounded-xl bg-violet-500/20 p-3">
              <Link2 className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">간편한 링크 관리</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              몇 번의 클릭만으로 링크를 추가, 수정, 삭제할 수 있습니다. 드래그 앤
              드롭으로 순서도 자유롭게.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10">
            <div className="mb-4 inline-flex rounded-xl bg-blue-500/20 p-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">클릭 통계</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              누가 어떤 링크를 클릭했는지 실시간으로 확인하세요. 인사이트를 통해
              더 나은 콘텐츠를 만들어보세요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10">
            <div className="mb-4 inline-flex rounded-xl bg-cyan-500/20 p-3">
              <Globe className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">나만의 프로필 페이지</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              세련된 프로필 페이지를 만들고 SNS, 명함, 어디든 공유하세요. 나만의
              URL로 접근 가능합니다.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-muted-foreground">
            지금 바로 시작하세요. 무료입니다. ✨
          </p>
          <form action={signInWithGoogle}>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="rounded-full border-white/20 px-8 py-6 text-lg transition-all hover:border-violet-400/50 hover:bg-violet-500/10"
            >
              무료로 시작하기
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
