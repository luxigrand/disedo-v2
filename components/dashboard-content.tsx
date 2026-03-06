"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogoutButton from "@/components/logout-button";
import { Circle } from "lucide-react";
import ServerSidebar from "@/components/server-sidebar";

interface User {
  id: string;
  email?: string;
  last_sign_in_at?: string;
}

interface Profile {
  user_id: string;
  username: string;
  avatar_url?: string;
  last_online?: string;
}

interface Server {
  id: string;
  name: string;
  icon_url?: string;
  categories: Category[];
  channels: Channel[];
}

interface Category {
  id: string;
  name: string;
  position: number;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  category_id?: string;
  position: number;
}

interface DashboardContentProps {
  initialUser: User;
  initialProfile: Profile | null;
  servers?: Server[];
}

export default function DashboardContent({
  initialUser,
  initialProfile,
  servers = [],
}: DashboardContentProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);

  // Durum hesaplama fonksiyonu
  const getStatus = (lastOnline?: string) => {
    if (!lastOnline) return { text: "Offline", isOnline: false };
    
    const lastOnlineDate = new Date(lastOnline);
    const now = new Date();
    const diffInSeconds = (now.getTime() - lastOnlineDate.getTime()) / 1000;
    
    // Son 1 dakika (60 saniye) içindeyse online
    const isOnline = diffInSeconds <= 60;
    
    return {
      text: isOnline ? "Online" : "Offline",
      isOnline,
    };
  };

  // Her 60 saniyede bir last_online'ı güncelle
  useEffect(() => {
    const updateLastOnline = async () => {
      try {
        await fetch("/api/update-last-online", {
          method: "POST",
        });

        // Profil bilgilerini güncelle
        const clientSupabase = createClient();
        const { data: updatedProfile } = await clientSupabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", initialUser.id)
          .single();

        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      } catch (err) {
        console.error("Failed to update last_online:", err);
      }
    };

    // İlk yüklemede güncelle
    updateLastOnline();

    // Her 60 saniyede bir güncelle
    const interval = setInterval(updateLastOnline, 60000);

    return () => clearInterval(interval);
  }, [initialUser.id]);

  const status = getStatus(profile?.last_online);

  return (
    <div className="flex h-screen">
      <ServerSidebar servers={servers} />
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hoş Geldiniz!</CardTitle>
              <CardDescription>
                Giriş yaptığınız bilgiler aşağıda görüntülenmektedir
              </CardDescription>
            </div>
            <LogoutButton />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Kullanıcı ID
              </h3>
              <p className="mt-1 text-sm font-mono">{initialUser.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                E-posta
              </h3>
              <p className="mt-1 text-sm">{initialUser.email}</p>
            </div>
            {profile && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Kullanıcı Adı
                  </h3>
                  <p className="mt-1 text-sm">{profile.username}</p>
                </div>
                {profile.avatar_url && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Avatar
                    </h3>
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="mt-2 h-20 w-20 rounded-full"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Durum
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Circle
                      className={`h-3 w-3 ${
                        status.isOnline
                          ? "fill-green-500 text-green-500"
                          : "fill-gray-400 text-gray-400"
                      }`}
                    />
                    <p className="text-sm">{status.text}</p>
                  </div>
                </div>
              </>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Son Giriş
              </h3>
              <p className="mt-1 text-sm">
                {initialUser.last_sign_in_at
                  ? new Date(initialUser.last_sign_in_at).toLocaleString("tr-TR")
                  : "Bilinmiyor"}
              </p>
            </div>
            {profile?.last_online && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Son Online
                </h3>
                <p className="mt-1 text-sm">
                  {new Date(profile.last_online).toLocaleString("tr-TR")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
