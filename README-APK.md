# Yer İmleri M — APK Build Rehberi

Bu paket, **Yer İmleri M** uygulamasını GitHub Actions ile otomatik olarak **imzalı APK**'ya dönüştürmek için gereken tüm dosyaları içerir.

## 📦 Bu Pakette Neler Var?

| Dosya | Açıklama |
|---|---|
| `package.json` | Capacitor bağımlılıkları eklenmiş hali |
| `capacitor.config.ts` | Capacitor yapılandırması |
| `vite.config.ts` | Base path = `./` (native için şart) |
| `index.html` | Mobile viewport meta etiketleri |
| `src/main.tsx` | StatusBar başlatma |
| `src/App.tsx` | Back button handler + Browser.open entegrasyonu |
| `src/services/platform.ts` | Platform detection helper |
| `src/services/exporters.ts` | Platform-aware dosya indirme |
| `.github/workflows/build-apk.yml` | **İmzalı release APK** üretir (secrets gerekli) |
| `.github/workflows/build-debug-apk.yml` | **İmzasız debug APK** üretir (secret gerekmez, hızlı test) |

---

## 🚀 Hızlı Başlangıç (3 Adım)

### 1️⃣ Dosyaları Repona Kopyala

Bu paketteki dosyaları **mevcut GitHub repona** aynı yolları koruyarak kopyala (üzerine yaz):

```

Yer-mleri-M/
├── .github/workflows/build-apk.yml        ← YENİ
├── .github/workflows/build-debug-apk.yml  ← YENİ
├── package.json                            ← GÜNCELLENDİ
├── capacitor.config.ts                     ← YENİ
├── vite.config.ts                          ← GÜNCELLENDİ
├── index.html                              ← GÜNCELLENDİ
└── src/
├── main.tsx                            ← GÜNCELLENDİ
├── App.tsx                             ← GÜNCELLENDİ
└── services/
├── exporters.ts                    ← GÜNCELLENDİ
└── platform.ts                     ← YENİ

```

Sonra commit + push:
```bash
git add .
git commit -m "feat: add Capacitor + GitHub Actions APK build"
git push origin main
```

### 2️⃣ İmzalama Anahtarı (Keystore) Oluştur

**Tek seferlik** yapılır. Bilgisayarında Java yüklü olmalı:

```
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

Sorulara cevap ver (şifreyi **kesinlikle unutma!**). Sonra base64'e çevir:

**Linux / macOS:**

```
base64 -i release.jks -o keystore.base64.txt
```

**Windows (PowerShell):**

```
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.jks")) | Out-File -Encoding ASCII keystore.base64.txt
```

`keystore.base64.txt` içeriğini kopyala.

> ⚠️ **`release.jks` dosyasını ASLA repoya commit etme.** `.gitignore`'a ekle:
> 
> ```
> release.jks
> keystore.base64.txt
> ```

### 3️⃣ GitHub Secrets Ekle

GitHub reponda: **Settings → Secrets and variables → Actions → New repository secret**

| Secret Adı | Değeri |
|---|---|
| `KEYSTORE_BASE64` | `keystore.base64.txt` içeriğinin tamamı |
| `KEYSTORE_PASSWORD` | Keystore şifresi |
| `KEY_ALIAS` | `release` |
| `KEY_PASSWORD` | Key şifresi (genelde aynı) |

---

## 🎯 Build'i Tetikleme

### Otomatik (push ile)

`main` branch'ine push yaptığında **hem** imzalı release APK **hem de** debug APK üretilir.

### Manuel

GitHub → **Actions** sekmesi → **Build Signed Release APK** → **Run workflow** → **Run workflow**

### APK'yı İndirme

Actions sekmesinde biten workflow'a tıkla → sağ altta **Artifacts** → `yer-imleri-m-release-apk.zip` → indir → aç → içinde `app-release.apk` var.

Bu APK'yı telefona kopyalayıp kurabilirsin.

---

## 🐛 Debug APK (Hızlı Test)

Sadece denemek istiyorsan **secrets gerekmez**. `main`'e her push'ta `yer-imleri-m-debug-apk.zip` artifact'ı da üretilir. İçindeki `app-debug.apk` imzasızdır ama telefona kurulabilir.

---

## 🔧 Yerel Build (Opsiyonel)

Bilgisayarında Android Studio varsa:

```
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio içinden `Build → Generate Signed Bundle / APK` ile APK üretebilirsin.

---

## ⚠️ Bilinmesi Gerekenler

### Ne Değişti?

1. **Yer imi açma** → `Browser.open()` kullanılıyor (native'de sistem tarayıcıda açılır, web'de `window.open` fallback var).
2. **Dosya indirme** → Native'de `Filesystem` + `Share` (paylaş menüsü açılır), web'de eski `a.click()` davranışı.
3. **Back tuşu** → Klasör içindeyken üst klasöre çıkar, kökteyken uygulamayı kapatır.
4. **StatusBar** → Uygulama rengiyle uyumlu.

### Ne DEĞİŞMEDİ?

- `localStorage` tabanlı veri — native'de de çalışır ama **tarayıcıdaki verilerle paylaşılmaz** (ayrı depolama alanı).
- Tüm UI/UX — aynı React kodu.
- Tema ayarları, sıralama, içe/dışa aktarma — aynı.

### Sınırlamalar

- **İnternet gerekir mi?** Hayır, uygulama tamamen offline çalışır.
- **Favicon'lar** için internet gerekir (Google S2 servisi), ama kapalıysa yer tutucu ikon gösterilir.
- **Import** işlemi için `@capacitor/filesystem` kullanılmadı — dosya seçimi `<input type="file">` ile yapılıyor, Android WebView'de çalışır. Ama büyük dosyalarda sorun yaşarsan `@capacitor/filesystem`'e geçilebilir.

---

## 🆘 Sorun Giderme

| Sorun | Çözüm |
|---|---|
| Build "Gradle failed" hatası | `capacitor.config.ts` içindeki `appId`'yi kontrol et (nokta içermeli, örn: `com.ornek.app`) |
| APK telefona kurulmuyor | "Bilinmeyen kaynaklara izin ver" ayarını aç |
| `Browser.open is not a function` | `npm install @capacitor/browser` eksik |
| Build artifact boş | Actions log'unda hatayı ara, genelde `npx cap sync` başarısız olur |
| İmza hatası | Secrets'ta `KEYSTORE_BASE64` yanlış kopyalanmış olabilir (satır sonu vs.) |

---

## 📚 Faydalı Linkler

- [Capacitor Docs](https://capacitorjs.com/docs)
- [GitHub Actions for Capacitor](https://capacitorjs.com/docs/ci-cd/github-actions)
- [Android Signing Guide](https://developer.android.com/studio/publish/app-signing)

---

**Sorular için GitHub issue açabilirsin. İyi kodlamalar! 🚀**

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
    "preview": "vite preview --port 3000",
    "cap:sync": "npx cap sync android",
    "cap:open": "npx cap open android",
    "cap:build": "npm run build && npx cap sync android",
    "apk:debug": "cd android && ./gradlew assembleDebug",
    "apk:release": "cd android && ./gradlew assembleRelease"
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

