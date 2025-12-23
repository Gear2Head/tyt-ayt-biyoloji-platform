# 🚀 Vercel Deployment Guide

## Neden Vercel?

✅ **Anında Deploy**: Git push ile otomatik deployment  
✅ **Gerçek Zamanlı Test**: Production URL ile hemen test  
✅ **Bedava Hosting**: Hobby plan ücretsiz  
✅ **Environment Variables**: Kolay yönetim  
✅ **HTTPS**: Otomatik SSL sertifikası  

---

## 📋 Deployment Adımları

### 1️⃣ GitHub'a Push

Önce projeyi GitHub'a yükleyin:

```bash
# Git repository oluştur (henüz yoksa)
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: TYT-AYT Biology Platform"

# GitHub'da yeni repo oluştur ve bağla
git remote add origin https://github.com/YOUR_USERNAME/tyt-ayt-biyoloji-platform.git

# Push et
git push -u origin main
```

---

### 2️⃣ Vercel'e Deploy

#### A. Vercel'e Giriş
1. [vercel.com](https://vercel.com) adresine git
2. "Sign Up" veya GitHub ile giriş yap

#### B. Projeyi Import Et
1. Dashboard'da **"Add New..."** → **"Project"** tıkla
2. GitHub repo'nuzu seç: `tyt-ayt-biyoloji-platform`
3. Import butonuna tıkla

#### C. Environment Variables Ekle

**⚠️ ÖNEMLİ**: Deploy etmeden önce environment variables ekleyin!

**Environment Variables** bölümünde şunları ekleyin:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_XANO_BASE_URL` | `https://x8ki-letl-twmt.n7.xano.io/api:YOUR_WORKSPACE_ID` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `senerkadiralper@gmail.com` |
| `NEXT_PUBLIC_ADMIN_CONSOLE_CODE` | `GearAdmin9150` |

> 💡 **Not**: Xano API URL'inizi Xano dashboard → Settings → API Base URL'den alabilirsiniz

#### D. Deploy Et
1. **"Deploy"** butonuna tıkla
2. Build süreci başlayacak (~2-3 dakika)
3. ✅ Deploy tamamlandığında production URL alacaksınız

---

### 3️⃣ Deployment URL'i

Deploy sonrası şuna benzer bir URL alacaksınız:
```
https://tyt-ayt-biyoloji-platform.vercel.app
```

veya özel domain:
```
https://your-custom-domain.com
```

---

## 🔧 Deploy Sonrası Kontroller

### ✅ Checklist

1. **Ana Sayfa**: `https://your-app.vercel.app` açılıyor mu?
2. **Login**: `/login` sayfası çalışıyor mu?
3. **Register**: `/register` ile hesap oluşturabiliyorsunuz mu?
4. **Dashboard**: Login sonrası `/dashboard` görünüyor mu?
5. **Topics**: `/topics` sayfası konuları gösteriyor mu?
6. **API Connection**: Xano backend bağlantısı çalışıyor mu?

---

## 🐛 Sorun Giderme

### Build Hatası
Eğer build sırasında hata alırsanız:

1. **Vercel Dashboard** → **Deployments** → İlgili deployment'a tıklayın
2. **"Building"** sekmesindeki logları inceleyin
3. Hata mesajını kopyalayın ve düzeltin

Yaygın hatalar:
- **Module not found**: `npm install` eksik paket
- **Type error**: TypeScript hataları
- **Environment variable**: `.env.local` değerleri eksik

### API Bağlantı Hatası

Eğer frontend çalışıyor ama Xano'ya bağlanamıyorsa:

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_XANO_BASE_URL` doğru mu kontrol edin
3. Xano API endpoint'lerinin **published** olduğundan emin olun
4. CORS ayarlarını kontrol edin (Xano'da)

---

## 🔄 Otomatik Deployment

Vercel kurulumundan sonra:

✅ Her `git push` otomatik deploy tetikler  
✅ Preview deployment'lar branch'ler için oluşturulur  
✅ Production deployment `main` branch için  

```bash
# Değişikliklerinizi commit edin
git add .
git commit -m "feat: Add new feature"

# Push ve otomatik deploy
git push origin main

# Vercel otomatik build ve deploy edecek! 🚀
```

---

## 📊 Vercel Dashboard

### Build Logs
- Her deployment'ın build loglarını görebilirsiniz
- Hata ayıklama için detaylı çıktılar

### Analytics (Opsiyonel)
- Sayfa görüntülemeleri
- Performans metrikleri
- Kullanıcı istatistikleri

### Domains
- Custom domain ekleyebilirsiniz
- Otomatik HTTPS sertifikası

---

## 💡 Önerilen Workflow

1. **Lokal Geliştirme**:
   ```bash
   npm run dev
   # http://localhost:3000
   ```

2. **Test**:
   - Özelliği local'de test edin
   - Sorunsuz çalıştığından emin olun

3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: Your feature"
   git push
   ```

4. **Vercel Auto-Deploy**:
   - Vercel otomatik build eder
   - Preview URL ile test edebilirsiniz
   - Sorunsu zsa production'a merge edin

---

## 🎯 Hızlı Başlangıç

Projeyi hemen deploy etmek için:

```bash
# Vercel CLI kur
npm i -g vercel

# Proje klasöründe
cd tyt-ayt-biyoloji-platform

# Deploy (tek komut!)
vercel

# Sorularvercel Deploy ile ilgili:
# ? Set up and deploy? Y
# ? Which scope? (your account seçin)
# ? Link to existing project? N
# ? What's your project's name? tyt-ayt-biyoloji-platform
# ? In which directory is your code located? ./

# Environment variables ekleyin
vercel env add NEXT_PUBLIC_XANO_BASE_URL production
# Xano URL'inizi yapıştırın

vercel env add NEXT_PUBLIC_ADMIN_EMAIL production
# senerkadiralper@gmail.com

vercel env add NEXT_PUBLIC_ADMIN_CONSOLE_CODE production
# GearAdmin9150

# Production deploy
vercel --prod
```

---

## ✨ Sonuç

Artık projeniz canlıda! 🎉

- **Production URL**: Vercel size verecek
- **Otomatik HTTPS**: ✅
- **Global CDN**: ✅
- **Otomatik Scaling**: ✅

Her değişikliğinizi `git push` ile anında yayınlayabilirsiniz!

---

## 📞 Destek

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
