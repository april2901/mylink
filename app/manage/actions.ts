"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLink(title: string, url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Get max position
  const { data: links } = await supabase
    .from("links")
    .select("position")
    .eq("user_id", user.id)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = links && links.length > 0 ? links[0].position + 1 : 0;

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title,
    url: url.startsWith("http") ? url : `https://${url}`,
    position: nextPosition,
    click_count: 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/manage");
}

export async function updateLink(id: string, title: string, url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("links")
    .update({
      title,
      url: url.startsWith("http") ? url : `https://${url}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/manage");
}

export async function deleteLink(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/manage");
}

export async function updateProfile(bio: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/manage");
}
