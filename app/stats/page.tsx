import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsContent } from "./stats-content";

export const metadata = {
  title: "통계 — mylink",
  description: "내 링크의 클릭 통계를 확인하세요",
};

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, click_count, position")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  return <StatsContent links={links || []} />;
}
