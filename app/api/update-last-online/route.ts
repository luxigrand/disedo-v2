import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // last_online'ı güncelle
  const { error } = await supabase
    .from("user_profiles")
    .update({ 
      last_online: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id);

  if (error) {
    // Eğer profil yoksa oluştur
    const { error: insertError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: user.id,
        username: user.email?.split("@")[0] || "user",
        last_online: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
