import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hoş Geldiniz</CardTitle>
          <CardDescription>
            Devam etmek için giriş yapın veya yeni bir hesap oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Kayıt Ol</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
