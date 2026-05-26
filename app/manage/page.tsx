import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileSection } from "@/components/profile-section";
import { LinkBlock } from "@/components/link-block";
import { AddLinkDialog } from "./add-link-dialog";

export const metadata = {
  title: "Manage — mylink",
  description: "링크를 관리하세요",
};

export default async function ManagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  let profile = null;
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    profile = existingProfile;
  } else {
    // Try to create profile on the fly (fails gracefully if DB schema isn't set up)
    const email = user.email || "";
    const username = email.split("@")[0] || "user";
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      username;
    const avatarUrl =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      "";

    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio: "",
      })
      .select()
      .single();

    if (newProfile) {
      profile = newProfile;
    } else {
      // Schema not set up
      return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 max-w-md backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">데이터베이스 설정이 필요합니다</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Supabase 데이터베이스에 <code className="text-violet-300 font-mono">profiles</code> 테이블이 존재하지 않거나 접근이 불가합니다.<br/><br/>
              프로젝트 루트에 있는 <span className="font-semibold text-foreground">supabase-setup.sql</span> 파일의 코드를 복사하여 <strong>Supabase 대시보드 ➔ SQL Editor</strong>에서 실행해 주시기 바랍니다!
            </p>
            <div className="flex gap-3 justify-center">
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                <button className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-4 py-2 text-sm font-semibold text-white cursor-pointer">
                  Supabase 대시보드로 이동
                </button>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute right-1/3 top-60 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pb-16">
        {/* Profile */}
        <ProfileSection profile={profile} isEditable={true} />

        {/* Add Link */}
        <div className="mb-6">
          <AddLinkDialog />
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links && links.length > 0 ? (
            links.map((link) => (
              <LinkBlock key={link.id} link={link} isOwner={true} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-lg text-muted-foreground">
                아직 링크가 없습니다
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                위의 버튼을 눌러 첫 번째 링크를 추가해보세요 ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
