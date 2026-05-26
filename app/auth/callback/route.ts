import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/manage";

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && authData.user) {
      // Upsert profile from Google data
      const email = authData.user.email || "";
      const username = email.split("@")[0];
      const displayName =
        authData.user.user_metadata?.full_name ||
        authData.user.user_metadata?.name ||
        username;
      const avatarUrl =
        authData.user.user_metadata?.avatar_url ||
        authData.user.user_metadata?.picture ||
        "";

      // Check if username already exists for a different user
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", authData.user.id)
        .single();

      if (!existingProfile) {
        // Check for username conflict
        let finalUsername = username;
        const { data: conflicting } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .single();

        if (conflicting) {
          // Add random suffix
          finalUsername = `${username}${Math.floor(Math.random() * 9999)}`;
        }

        await supabase.from("profiles").insert({
          id: authData.user.id,
          username: finalUsername,
          display_name: displayName,
          avatar_url: avatarUrl,
          bio: "",
        });
      } else {
        // Update avatar and display name on every login
        await supabase
          .from("profiles")
          .update({
            display_name: displayName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", authData.user.id);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=auth`);
}
