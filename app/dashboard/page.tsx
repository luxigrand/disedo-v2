import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Kullanıcı profil bilgilerini al
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // İlk yüklemede last_online'ı güncelle
  if (user) {
    try {
      await supabase
        .from("user_profiles")
        .update({
          last_online: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } catch (err) {
      // Hata olsa bile devam et
      console.error("Failed to update last_online on page load:", err);
    }
  }

  return (
    <DashboardContent
      initialUser={{
        id: user.id,
        email: user.email,
        last_sign_in_at: user.last_sign_in_at,
      }}
      initialProfile={profile}
    />
  );
}
