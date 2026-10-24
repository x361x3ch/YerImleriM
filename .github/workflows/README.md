# GitHub Actions Workflows

Bu klasörde iki workflow var:

## 1. `build-apk.yml` — Signed Release APK

**Tetikleyiciler:** `main` veya `master` branch'ine push, manuel `Run workflow`.

**Gereksinimler:** 4 adet GitHub Secret:
- `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

**Çıktı:** `yer-imleri-m-release-apk.zip` → `app-release.apk` (imzalı, telefona kurulabilir).

**Secret eksikse:** Build hata verir, `::error::` mesajı gösterir.

## 2. `build-debug-apk.yml` — Unsigned Debug APK

**Tetikleyiciler:** `main` veya `master` branch'ine push, manuel `Run workflow`.

**Gereksinimler:** Yok. Secret gerekmez.

**Çıktı:** `yer-imleri-m-debug-apk.zip` → `app-debug.apk` (debug keystore ile imzalı, test için).

**Ne zaman kullan:** Secrets'ı ayarlamadan önce hızlıca APK denemek istediğinde.

## ⚠️ Önemli Notlar

1. **İlk build uzun sürer** (~5-10 dk) çünkü Android SDK indirilir. Sonraki buildler cache sayesinde daha hızlı (~2-3 dk).

2. **`android/` klasörü repoda yok.** `.gitignore` içinde. Workflow her çalıştığında `npx cap add android` ile yeniden oluşturur. Bu normal.

3. **`npm ci` başarısız olursa `npm install` fallback var.** `package-lock.json` yoksa otomatik düşer.

4. **APK artifact'ları 30 gün saklanır** (release) / 14 gün (debug). Sonra silinir.

5. **Bir build başarısız olursa** Actions sekmesinde kırmızı ✗ işaretine tıkla → log'u aç → hangi adımda patladığına bak.
