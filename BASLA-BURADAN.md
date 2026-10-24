# 🚀 Yer İmleri M → APK (En Basit Yol)

Bu paket, uygulamanı **GitHub Actions ile otomatik olarak APK'ya çevirir**. Keystore, imza, secret — hiçbiriyle uğraşmayacaksın. Sadece dosyaları yükle, push et, Actions'tan APK'yı indir.

## ✋ Başlamadan Önce

Bu paket **debug APK** üretir. Debug APK:
- ✅ Telefona kurulur ve çalışır
- ✅ Ücretsiz, imza gerektirmez
- ❌ Play Store'a yüklenemez (ileride istersen ayrıca konuşuruz)
- ⚠️ Yeni sürüm çıkardığında eski APK'yı telefonda silip yenisini kurmalısın

Şu an sadece "kendi telefonumda çalışsın" istiyorsan bu yeterli. Play Store'a koymak istersen bana hatırlat, o zaman keystore kısmını adım adım anlatırım.

---

## 📋 Ne Yapacaksın?

### Adım 1: Dosyaları Kopyala

Bu paketteki dosyaları **mevcut GitHub repona** aynı yollara kopyala:

```

Yer-mleri-M/
├── .github/workflows/build-debug-apk.yml   ← YENİ
├── package.json                              ← GÜNCELLENDİ
├── capacitor.config.ts                       ← YENİ
├── vite.config.ts                            ← GÜNCELLENDİ
├── index.html                                ← GÜNCELLENDİ
├── .gitignore                                ← GÜNCELLENDİ
└── src/
├── main.tsx                              ← GÜNCELLENDİ
├── App.tsx                               ← GÜNCELLENDİ
└── services/
├── exporters.ts                      ← GÜNCELLENDİ
└── platform.ts                       ← YENİ

```

> 💡 **"Üzerine yaz"** — mevcut dosyaların içeriğini değiştir. Silme, sadece içeriğini güncelle.

### Adım 2: Push Et

Terminalde:

```bash
git add .
git commit -m "add apk build"
git push
```

> 💡 `git` bilmiyorsan: GitHub Desktop veya VS Code'un sol alt köşesindeki Source Control sekmesinden de aynı işi yapabilirsin — dosyaları kaydet, commit mesajı yaz, "Push"a bas.

### Adım 3: GitHub'da Actions'a Git

Reponu tarayıcıda aç:

- Üstten **Actions** sekmesine tıkla
- Soldan **Build Debug APK (Unsigned, quick test)** işini seç
- En son çalışan build'in üstüne tıkla
- Sağda **Artifacts** başlığı altında **yer-imleri-m-debug-apk** dosyasına tıkla → ZIP iner

> ⏱️ **İlk build 5-10 dakika sürer.** Sabırlı ol. Sayfa otomatik yenilenmez, kendin F5 at.
> 
> 🟡 Sarı nokta = çalışıyor
> 🟢 Yeşil tik = başarılı → Artifact indirilebilir
> 🔴 Kırmızı çarpı = hata → bana logu gönder

### Adım 4: APK'yı Telefona Kur

İnen ZIP'i aç → içinde `app-debug.apk` var.

**Yöntem A — WhatsApp/Telegram ile:**
APK'yı kendine WhatsApp'tan gönder, telefondan indir, üstüne dokun.

**Yöntem B — USB ile:**
Telefonu USB ile bağla, APK'yı telefona at, dosya yöneticisinden bul, üstüne dokun.

**Yöntem C — Google Drive:**
Drive'a yükle, telefonda Drive uygulamasından indir, aç.

Kurulum sırasında **"Bilinmeyen kaynaklara izin ver"** uyarısı çıkarsa → **Ayarlar → İzin Ver** → kuruluma devam et.

Kurulduktan sonra **Yer İmleri M** uygulama simgesi ana ekranında görünür. 🎉

---

## 🆘 Bir Şey Ters Giderse

| Sorun | Sebep | Çözüm |
|---|---|---|
| Actions'ta kırmızı ✗ | Kod hatası, build patladı | Actions'a tıkla, "Build debug APK" adımının logunu aç, son 20 satırı bana yolla |
| Actions hiç görünmüyor | `.github/workflows/` klasörü repoda yok | Dosyayı doğru yere kopyaladığından emin ol: `.github/workflows/build-debug-apk.yml` |
| Build "5 dk sonra hâlâ sarı" | Normal, Android SDK indiriyor | Bekle, 10 dk'ya kadar sürebilir |
| APK telefona kurulmuyor | "Bilinmeyen kaynaklar" kapalı | Ayarlar → Güvenlik → Bilinmeyen kaynaklar → tarayıcı/dosya yöneticisine izin ver |
| Uygulama açılıyor ama boş beyaz ekran | Base path sorunu | `vite.config.ts` içinde `base: './'` olduğundan emin ol |
| Uygulamada bir yer imine basınca hiçbir şey olmuyor | Capacitor Browser eksik | Build logu kontrol et, `@capacitor/browser` yüklü mü? |

---

## ❓ Sık Sorulan

**S: APK ne kadar yer kaplar?**
C: ~4-6 MB civarı.

**S: İnternet gerekli mi?**
C: Hayır, uygulama offline çalışır. Sadece yer imi favicon'ları için internet gerekir (kapatılabilir).

**S: Verilerim nereye kaydediliyor?**
C: Telefondaki uygulamanın kendi hafızasına (localStorage). Bilgisayardaki tarayıcı verilerinle **paylaşılmaz**. Uygulamayı silersen veriler gider — düzenli olarak `Ayarlar → Dışa Aktar` ile yedek al.

**S: Güncelleme nasıl yaparım?**
C: Kodu düzelt → push → Actions'tan yeni APK indir → telefonda eski uygulamayı sil → yenisini kur.

**S: Play Store'a koymak istersem?**
C: O zaman ayrı bir işlem gerekir (release keystore + imzalı AAB). Şimdilik gerek yok.

**S: Neden "unsigned" yazıyor?**
C: Debug APK aslında Android'in debug keystore'uyla imzalanır. "Unsigned" dememin sebebi, senin kendi keystore'unla imzalanmamış olması. Çalışmasına engel değil.

---

## 🎉 Bitti!

Takıldığın yer olursa Actions log'unu veya hata mesajını bana at, hemen bakarız.

</BDS:create_file>

<BDS:create_file fileName="package.json">

```json
{
  "name": "yerimlerim-web",
  "private": true,
  "version": "4.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
    "build": "tsc && vite build",
    "preview": "vite preview --port 3000"
  },
  "dependencies": {
    "@capacitor/android": "^6.2.0",
    "@capacitor/app": "^6.0.1",
    "@capacitor/browser": "^6.0.2",
    "@capacitor/core": "^6.2.0",
    "@capacitor/filesystem": "^6.0.1",
    "@capacitor/share": "^6.0.2",
    "@capacitor/status-bar": "^6.0.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.2.0",
    "@types/node": "^22.13.4",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}

