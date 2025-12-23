# 🧠 TYT-AYT Biyoloji Eğitim Platformu

**Profesyonel, AI Destekli, Rol Bazlı Eğitim Platformu**

Modern, güvenli ve ölçeklenebilir bir TYT-AYT biyoloji eğitim platformu. MEB müfredatına %100 uyumlu yapı ile AI destekli kişisel çalışma planları sunar.

## ✨ Özellikler

### 🔐 Güvenlik ve Yetkilendirme
- **Rol Bazlı Erişim**: Admin / Moderatör / Üye rolleri
- **Gizli Admin Konsolu**: Email + gizli kod ile erişim
- **Firebase Authentication**: Güvenli kullanıcı yönetimi
- **Session Management**: Oturum persistans sistemi
- **Lockout Mechanism**: 5 yanlış denemede 10 dakika kilit

### 🎨 Premium UI/UX
- **Modern Design System**: Vibrant renkler, glassmorphism efektleri
- **Responsive**: Tüm cihazlarda kusursuz deneyim
- **Animasyonlar**: Framer Motion ile akıcı geçişler
- **Dark Mode Ready**: Hazır dark tema desteğ

i
- **Google Fonts**: Inter & Outfit premium fontları

### 👤 Kullanıcı Rolleri

#### 🛡️ Admin (Tek Hesap - Sabit)
**Email**: `senerkadiralper@gmail.com`
**Konsol Kodu**: `GearAdmin9150`

- Tüm sistemi yönetir
- Moderatör atar/kaldırır
- İçerik düzenler
- Yorumları yönetir
- AI içerik üretimini tetikler

#### 🧑‍⚖️ Moderatör
- Yorumları siler/düzenler/kilitler
- Spam yönetimi
- İçerik moderasyonu

#### 👥 Üye
- Yorum yapabilir
- Favori ekler
- Çalışma planı oluşturur

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ ve npm
- Xano.io hesabı (ücretsiz)
- Gemini API key (AI özellikler için - opsiyonel)

### Adımlar

1. **Depoyu Klonlayın**
```bash
git clone <repo-url>
cd tyt-ayt-biyoloji-platform
```

2. **Bağımlılıkları Kurun**
```bash
npm install
```

3. **Xano.io Backend Kurulumu**

**ÖNEMLI:** Backend kurulumu için `XANO_SETUP.md` dosyasını okuyun!

Özet:
- Xano.io workspace'inizde database tablolarını oluşturun
- API endpoint'lerini yapılandırın
- API base URL'inizi alın

4. **Environment Variables Ayarlayın**

`.env.local` dosyası oluşturun:

```env
# Xano Configuration
NEXT_PUBLIC_XANO_BASE_URL=https://x8ki-letl-twmt.n7.xano.io/api:YOUR_WORKSPACE_ID

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=senerkadiralper@gmail.com
NEXT_PUBLIC_ADMIN_CONSOLE_CODE=GearAdmin9150

# Gemini AI API Key (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

5. **Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

## 📁 Proje Yapısı

```
tyt-ayt-biyoloji-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Giriş sayfası
│   │   └── register/        # Kayıt sayfası
│   ├── dashboard/           # Kullanıcı dashboard'u
│   ├── profile/             # Profil sayfası
│   ├── layout.tsx           # Root layout + AuthProvider
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── admin/               # Admin konsolu
│   │   └── admin-console-unlock.tsx
│   └── auth/                # Auth components
│       └── role-guard.tsx
├── lib/
│   ├── firebase/
│   │   ├── config.ts        # Firebase init
│   │   └── auth-context.tsx # Auth provider
│   └── types.ts             # TypeScript types
└── public/
```

## 🔒 Gizli Admin Konsol Erişimi

### Nasıl Çalışır?

1. **Admin Email ile Giriş**: `senerkadiralper@gmail.com`
2. **Dashboard'da Konsol Görünür**: Sadece admin için
3. **Gizli Kodu Girin**: `GearAdmin9150`
4. **Konsol Açılır**: Yönetim paneline erişim

### Güvenlik Özellikleri
- ❌ Normal kullanıcılar göremez
- ❌ URL ile erişilemez
- ✅ Session bazlı kilitleme
- ✅ 5 yanlış deneme = 10 dk kilit
- ✅ Tüm denemeler loglanır

## 🧪 Test Hesapları

### Admin
- **Email**: `senerkadiralper@gmail.com`
- **Konsol Kodu**: `GearAdmin9150`

### Üye
Kayıt sayfasından istediğiniz email ile kayıt oluşturabilirsiniz.

## 🛠️ Teknoloji Stack'i

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Framer Motion** - Animasyonlar
- **Lucide React** - İkonlar

### Backend
- **Xano.io** - No-code backend platform
- **REST API** - RESTful endpoints
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL** - Database (managed by Xano)
- **Xano Functions** - Backend logic

### AI & Integration
- **Google Gemini API** - AI özellikleri
- **Zustand** - State management (opsiyonel)

## 📝 Geliştirme Durumu

### ✅ Tamamlanan
- [x] Proje yapısı ve kurulum
- [x] Firebase entegrasyonu
- [x] Authentication sistemi
- [x] Rol bazlı erişim kontrolü
- [x] Gizli admin konsolu
- [x] Premium UI design system
- [x] Landing page
- [x] Login/Register sayfaları
- [x] Dashboard
- [x] Profil sayfası

### 🚧 Devam Eden / Planlanan
- [ ] MEB TYT-AYT müfredat içeriği
- [ ] Konu detay sayfaları
- [ ] AI konu özetleri
- [ ] Kişisel çalışma planı
- [ ] Yorum sistemi
- [ ] Moderatör paneli
- [ ] Admin yönetim paneli
- [ ] Firestore security rules
- [ ] Firebase Functions deployment

## 🔥 Firebase Deployment

```bash
# Firebase CLI kurulumu
npm install -g firebase-tools

# Login
firebase login

# Init
firebase init

# Deploy
firebase deploy
```

## 📚 Dokümantasyon

Detaylı dokümantasyon için `implementation_plan.md` dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel bir eğitim projesi olarak geliştirilmiştir.

## 💡 Gelecek Özellikler (v2)

- 📱 PWA & Mobile App
- 🧪 AI soru üretici
- 🏆 Rozet & seviye sistemi
- ⏳ "Son 7 Gün" sınav modu
- 📊 Deneme analiz sistemi
- 🔔 Akıllı bildirimler
- 👀 Öğrenci ilerleme takibi
- 🌍 Çoklu dil desteği

## 🐛 Sorun Bildirimi

Bir sorun mu buldunuz? [Issues](https://github.com/your-repo/issues) sayfasından bildirebilirsiniz.

## 📧 İletişim

**Proje Sahibi**: Kadir Alper Sener  
**Email**: senerkadiralper@gmail.com

---

**Made with ❤️ and ☕ for TYT-AYT Students**
