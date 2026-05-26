import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mylink.vercel.app"),
  title: "mylink — 모든 링크를 한 곳에",
  description:
    "나만의 링크 페이지를 만들어 공유하세요. 클릭 통계와 함께 간편하게 링크를 관리합니다.",
  openGraph: {
    title: "mylink — 모든 링크를 한 곳에",
    description:
      "나만의 링크 페이지를 만들어 공유하세요. 클릭 통계와 함께 간편하게 링크를 관리합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "mylink",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 1200,
        alt: "mylink — 모든 링크를 한 곳에",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "mylink — 모든 링크를 한 곳에",
    description:
      "나만의 링크 페이지를 만들어 공유하세요. 클릭 통계와 함께 간편하게 링크를 관리합니다.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userProfile = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      userProfile = profile;
    }
  } catch {
    // Not authenticated, that's fine
  }

  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar user={userProfile} />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
