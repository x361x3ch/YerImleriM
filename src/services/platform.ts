/**
 * Platform detection ve native bridge helper'ları.
 *
 * Tüm Capacitor çağrıları dinamik import ile yapılır çünkü:
 * 1. Web build'inde Capacitor paketleri gereksiz yüklenmez
 * 2. Capacitor kurulu değilse web build'i bozulmaz
 * 3. Ağır native modüller lazy yüklenir
 */

export const isNative = (): boolean => {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  return !!(w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function' && w.Capacitor.isNativePlatform());
};

export const isAndroid = (): boolean => {
  if (!isNative()) return false;
  const w = window as any;
  return w.Capacitor.getPlatform?.() === 'android';
};

/**
 * Yer imini platforma göre aç.
 * - Native: Capacitor Browser ile (uygulama içi tarayıcı)
 * - Web: window.open (yeni sekme)
 */
export const openUrl = async (url: string): Promise<void> => {
  if (!url) return;

  if (isNative()) {
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, presentationStyle: 'fullscreen' });
      return;
    } catch (e) {
      console.warn('Browser.open failed, falling back to window.open', e);
    }
  }

  // Web fallback
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Dosya indir / paylaş.
 * - Native: Filesystem ile cache'e yaz + Share ile paylaş menüsünü aç
 * - Web: Blob + a.click() indirme
 */
export const downloadOrShareFile = async (
  content: string,
  filename: string,
  mimeType: string
): Promise<void> => {
  if (isNative()) {
    try {
      const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');

      const result = await Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
        recursive: true,
      });

      await Share.share({
        title: filename,
        text: filename,
        url: result.uri,
        dialogTitle: 'Dosyayı kaydet veya paylaş',
      });
      return;
    } catch (e) {
      console.warn('Filesystem/Share failed, falling back to web download', e);
    }
  }

  // Web fallback
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * StatusBar'ı tema rengine göre ayarla (sadece native).
 */
export const setupStatusBar = async (backgroundColor: string, isDark: boolean): Promise<void> => {
  if (!isNative()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setBackgroundColor({ color: backgroundColor });
    await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
  } catch (e) {
    console.warn('StatusBar setup failed', e);
  }
};

/**
 * Android donanım geri tuşu için listener.
 * Callback true dönerse "event handled" sayılır (uygulama kapanmaz).
 */
export const registerBackButton = (
  handler: () => boolean
): (() => void) | null => {
  if (!isNative()) return null;

  let removeListener: (() => void) | null = null;

  (async () => {
    try {
      const { App: CapApp } = await import('@capacitor/app');
      const listener = await CapApp.addListener('backButton', () => {
        const handled = handler();
        if (!handled) {
          CapApp.exitApp();
        }
      });
      removeListener = () => {
        listener.remove();
      };
    } catch (e) {
      console.warn('Back button listener failed', e);
    }
  })();

  return () => {
    if (removeListener) removeListener();
  };
};
