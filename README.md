# Yer İmleri M — Web (React)

Sade liste tabanlı, sınırsız iç içe klasörlü, Flaticon simgeli, özelleştirilebilir temalı modern yer imi yöneticisi.

## Özellikler

- **Flaticon Simge Paketi**: 12 adet özgün vektör ikon (Klasör, Ev, Yıldız, Kalp, Kitap, İş, Oyun, Alışveriş, Müzik, Film, Yemek, Evcil Hayvan) varsayılan olarak entegre edilmiştir.
- **Ana Ekranda Gezinerek Ekleme, Taşıma ve Kopyalama**:
  - Yer imi eklerken, taşırken veya kopyalarken küçük modal listesi yerine ana ekranda serbestçe klasörler arasında gezinip hedef klasörde doğrudan "Buraya Taşı / Buraya Kopyala / Buraya Ekle" butonuna basarak işlem yapılabilir.
  - Paylaşım modu simülatörüyle de aynı akış deneyimlenebilir.
- **Gelişmiş Sıralama & Sürükle-Bırak**:
  - Tarih veya ada göre sıralı olsa bile ögeler basılı tutularak sürüklenebilir; sıralama otomatik olarak "Özel" moda geçer ve yeni yerleşim korunur.
  - Klasör bazlı sıralama: Her klasör kendi bağımsız sıralama moduna (Özel, Tarih yeni-eski, Tarih eski-yeni, A-Z, Z-A) sahip olabilir.
  - **Klasörleri üstte tutma seçeneği**: Aktif olduğunda klasörler her zaman en üstte gruplanır; kapatıldığında klasörler yer imleri gibi sıralamaya dahil edilir ve aralarda listelenir.
- **Düzeltilmiş İçe Aktarma (Nested Folders Fix)**:
  - Netscape HTML yer imi dosyalarındaki iç içe sınırsız klasör yapısı (Chrome, Firefox, Safari vb.) boş klasör sorunu olmadan tam hiyerarşiyle içe aktarılır.
  - JSON, Düz HTML ve Markdown / Metin içe ve dışa aktarma seçenekleri.
- **Detaylı Tema & Görüntü Özelleştirme**:
  - 12 farklı arayüz rengi için canlı Hex renk seçimi ve hazır tema paletleri.
  - Başlık, URL ve klasör yazı boyutları ve renk geçersiz kılmaları.
  - Google S2 Favicon desteği.
- **Çoklu Seçim & Toplu İşlemler**:
  - Toplu taşıma, kopyalama, silme ve dışa aktarma.

## Geliştirme

```bash
npm install
npm run dev
```

Dev sunucusu port 3000 üzerinden dinler.
