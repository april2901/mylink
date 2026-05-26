import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileSection } from "@/components/profile-section";
import { LinkBlock } from "@/components/link-block";
import type { Metadata } from "next";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "User not found — mylink" };
  }

  const title = `${profile.display_name || username}의 mylink`;
  const description = profile.bio || `${profile.display_name || username}의 프로필 및 링크 페이지`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      username: username,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .order("position", { ascending: true });

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute right-1/3 top-60 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pb-16">
        {/* Profile (read-only) */}
        <ProfileSection profile={profile} isEditable={false} />

        {/* Links */}
        <div className="space-y-3">
          {links && links.length > 0 ? (
            links.map((link) => (
              <LinkBlock key={link.id} link={link} isOwner={false} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-lg text-muted-foreground">
                아직 링크가 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
