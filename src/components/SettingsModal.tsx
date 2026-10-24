import React, { useState } from 'react';
import { DisplaySettingsState, IconPack } from '../types';
import { DEFAULT_DISPLAY_SETTINGS } from '../services/theme';
import { X, Sliders, Check, RotateCcw, Upload, Download, Sparkles } from 'lucide-react';

interface Props {
  currentSettings: DisplaySettingsState;
  onSave: (settings: DisplaySettingsState) => void;
  onOpenImportExport: (tab: 'import' | 'export') => void;
  onClose: () => void;
}

const FONTS = [
  { id: 'system-ui', label: 'Sistem Yazı Tipi (Varsayılan)' },
  { id: 'Inter, sans-serif', label: 'Inter (Modern Sans)' },
  { id: 'Roboto, sans-serif', label: 'Roboto (Android Tarzı)' },
  { id: 'Georgia, serif', label: 'Georgia (Serif)' },
  { id: 'monospace', label: 'Monospace (Kod stili)' },
];

export const SettingsModal: React.FC<Props> = ({
  currentSettings,
  onSave,
  onOpenImportExport,
  onClose,
}) => {
  const [settings, setSettings] = useState<DisplaySettingsState>({ ...currentSettings });

  const handleReset = () => {
    setSettings({ ...DEFAULT_DISPLAY_SETTINGS });
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Görüntü ve Uygulama Ayarları</h3>
              <p className="text-[11px] text-gray-500">Boyutlar, ikon paketleri ve davranışlar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Section: Typography / Sizes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Görsel Boyutlar
            </h4>
            <div className="space-y-4">
              {/* Title Size */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Başlık Boyutu</span>
                  <span className="font-mono text-blue-600">{settings.titleSizeSp}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={settings.titleSizeSp}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, titleSizeSp: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* URL Size */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>URL Boyutu</span>
                  <span className="font-mono text-blue-600">{settings.urlSizeSp}px</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="24"
                  value={settings.urlSizeSp}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, urlSizeSp: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Folder Label Size */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Klasör Etiketi Boyutu</span>
                  <span className="font-mono text-blue-600">{settings.folderLabelSizeSp}px</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="24"
                  value={settings.folderLabelSizeSp}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, folderLabelSizeSp: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Color Overrides */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Özel Metin Renkleri (İsteğe Bağlı)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Başlık Rengi
                </label>
                <input
                  type="text"
                  placeholder="#0D0D0D"
                  value={settings.titleColorHex}
                  onChange={(e) => setSettings((s) => ({ ...s, titleColorHex: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">URL Rengi</label>
                <input
                  type="text"
                  placeholder="#5A5A5A"
                  value={settings.urlColorHex}
                  onChange={(e) => setSettings((s) => ({ ...s, urlColorHex: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Klasör Rengi
                </label>
                <input
                  type="text"
                  placeholder="#2F5BEA"
                  value={settings.folderColorHex}
                  onChange={(e) => setSettings((s) => ({ ...s, folderColorHex: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Icons & Font */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Simge Paketi & Yazı Tipi
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Klasör Simge Paketi
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'flaticon', label: 'Flaticon' },
                      { id: 'outline', label: 'Outline' },
                      { id: 'filled', label: 'Filled' },
                      { id: 'minimal', label: 'Minimal' },
                    ] as Array<{ id: IconPack; label: string }>
                  ).map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, iconPack: pack.id }))}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        settings.iconPack === pack.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {pack.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Yazı Tipi</label>
                <select
                  value={settings.customFont}
                  onChange={(e) => setSettings((s) => ({ ...s, customFont: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 bg-white"
                >
                  {FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Behaviors */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Davranış ve Görünürlük
            </h4>

            {/* Folders On Top */}
            <label className="flex items-start justify-between gap-3 cursor-pointer select-none p-2 rounded-xl hover:bg-gray-50">
              <div>
                <div className="text-xs font-semibold text-gray-900">Klasörleri üstte tut</div>
                <div className="text-[11px] text-gray-500">
                  İşaretlenmediğinde klasörler linkler gibi davranır ve sıralama sırasına göre yerleşir.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.foldersOnTop}
                onChange={(e) => setSettings((s) => ({ ...s, foldersOnTop: e.target.checked }))}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </label>

            {/* Favicons */}
            <label className="flex items-start justify-between gap-3 cursor-pointer select-none p-2 rounded-xl hover:bg-gray-50">
              <div>
                <div className="text-xs font-semibold text-gray-900">Faviconları göster</div>
                <div className="text-[11px] text-gray-500">
                  Sitelerin küçük logoları Google S2 servisiyle getirilir.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.faviconEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, faviconEnabled: e.target.checked }))}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </label>

            {/* Full Folder Path */}
            <label className="flex items-start justify-between gap-3 cursor-pointer select-none p-2 rounded-xl hover:bg-gray-50">
              <div>
                <div className="text-xs font-semibold text-gray-900">Tam klasör yolunu göster</div>
                <div className="text-[11px] text-gray-500">
                  Örn: "Geliştirme / Frontend" yerine sadece "Frontend" yerine tam yol.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showFullFolderPath}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, showFullFolderPath: e.target.checked }))
                }
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </label>
          </div>

          {/* Section: Import / Export quick access */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              İçe / Dışa Aktarma
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImportExport('import');
                }}
                className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                Dosya İçe Aktar
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImportExport('export');
                }}
                className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Tümünü Dışa Aktar
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200/60 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
