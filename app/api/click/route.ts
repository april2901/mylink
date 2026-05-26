import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json({ error: "linkId required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Use RPC to increment click count atomically
    const { error } = await supabase.rpc("increment_click", {
      link_id: linkId,
    });

    if (error) {
      // Fallback: direct update
      const { data: link } = await supabase
        .from("links")
        .select("click_count")
        .eq("id", linkId)
        .single();

      if (link) {
        await supabase
          .from("links")
          .update({ click_count: (link.click_count || 0) + 1 })
          .eq("id", linkId);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
