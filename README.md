# Disedo v2

Next.js tabanlı bir web uygulaması.

## Kullanılan Teknolojiler

- **Veritabanı**: Supabase
- **Veritabanı İletişimi**: Drizzle ORM
- **UI**: Shadcn
- **Sunucu**: Vercel
- **URL'de veri tutma**: nuqs

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
pnpm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
```

Supabase projenizden bu değerleri alabilirsiniz:
- [Supabase Dashboard](https://app.supabase.com) > Project Settings > API

### 3. Geliştirme sunucusunu başlatın

```bash
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Sayfalar

- **Ana Sayfa** (`/`): Giriş yapmamış kullanıcıları giriş/kayıt sayfalarına yönlendirir
- **Giriş Sayfası** (`/login`): Kullanıcı girişi
- **Kayıt Sayfası** (`/register`): Yeni kullanıcı kaydı
- **Dashboard** (`/dashboard`): Giriş yapmış kullanıcıların bilgilerini gösterir ve çıkış yapma imkanı sunar

## Özellikler

- ✅ Supabase Authentication entegrasyonu
- ✅ Kullanıcı giriş/kayıt sistemi
- ✅ Korumalı route'lar (middleware ile)
- ✅ Kullanıcı profil bilgileri görüntüleme
- ✅ Çıkış yapma özelliği
- ✅ Modern UI (Shadcn bileşenleri)
