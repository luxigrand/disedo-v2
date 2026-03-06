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

  // Kullanıcının üye olduğu server'ları al
  const { data: serverMembers } = await supabase
    .from("server_members")
    .select("server_id")
    .eq("user_id", user.id);

  const serverIds = serverMembers?.map((sm) => sm.server_id) || [];

  // Server bilgilerini al
  const { data: servers } = await supabase
    .from("servers")
    .select("*")
    .in("id", serverIds)
    .order("created_at", { ascending: true });

  // Server'ların kanallarını ve kategorilerini al
  let serversWithChannels = [];
  if (servers && servers.length > 0) {
    for (const server of servers) {
      // Kategorileri al
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("server_id", server.id)
        .order("position", { ascending: true });

      // Kanalları al
      const { data: channels } = await supabase
        .from("channels")
        .select("*")
        .eq("server_id", server.id)
        .order("position", { ascending: true });

      serversWithChannels.push({
        ...server,
        categories: categories || [],
        channels: channels || [],
      });
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
      servers={serversWithChannels || []}
    />
  );
}
