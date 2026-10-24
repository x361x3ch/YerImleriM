import React, { useState } from 'react';
import { ThemeColors } from '../types';
import { ThemeService, DEFAULT_THEME_COLORS } from '../services/theme';
import { X, RotateCcw, Check, Palette } from 'lucide-react';

interface Props {
  currentColors: ThemeColors;
  onSave: (colors: ThemeColors) => void;
  onClose: () => void;
}

const COLOR_KEYS: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: 'primary', label: 'Vurgu Rengi (Primary)' },
  { key: 'onPrimary', label: 'Vurgu Üstü Metin' },
  { key: 'background', label: 'Ana Arka Plan' },
  { key: 'surface', label: 'Yüzey / Kart Arka Planı' },
  { key: 'textPrimary', label: 'Ana Metin' },
  { key: 'textSecondary', label: 'İkincil Metin' },
  { key: 'toolbar', label: 'Üst Çubuk Arka Planı' },
  { key: 'toolbarText', label: 'Üst Çubuk Metin / Simgeler' },
  { key: 'divider', label: 'Ayırıcı Çizgiler' },
  { key: 'inputBg', label: 'Giriş Kutusu Arka Planı' },
  { key: 'inputText', label: 'Giriş Kutusu Metni' },
  { key: 'inputBorder', label: 'Giriş Kenarlık' },
  { key: 'error', label: 'Hata Rengi' },
];

const PRESETS: Array<{ name: string; colors: Partial<ThemeColors> }> = [
  {
    name: 'Varsayılan',
    colors: DEFAULT_THEME_COLORS,
  },
  {
    name: 'Karanlık Gece',
    colors: {
      primary: '#3B82F6',
      onPrimary: '#FFFFFF',
      background: '#121212',
      surface: '#1E1E1E',
      textPrimary: '#F3F4F6',
      textSecondary: '#9CA3AF',
      toolbar: '#181818',
      toolbarText: '#F3F4F6',
      divider: '#2A2A2A',
      inputBg: '#1E1E1E',
      inputText: '#F3F4F6',
      inputBorder: '#374151',
      error: '#EF4444',
    },
  },
  {
    name: 'Zümrüt Yeşili',
    colors: {
      primary: '#059669',
      onPrimary: '#FFFFFF',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      textPrimary: '#064E3B',
      textSecondary: '#047857',
      toolbar: '#FFFFFF',
      toolbarText: '#064E3B',
      divider: '#BBF7D0',
      inputBg: '#FFFFFF',
      inputText: '#064E3B',
      inputBorder: '#86EFAC',
      error: '#DC2626',
    },
  },
  {
    name: 'Sıcak Amber',
    colors: {
      primary: '#D97706',
      onPrimary: '#FFFFFF',
      background: '#FFFBEB',
      surface: '#FEF3C7',
      textPrimary: '#78350F',
      textSecondary: '#B45309',
      toolbar: '#FFFFFF',
      toolbarText: '#78350F',
      divider: '#FDE68A',
      inputBg: '#FFFFFF',
      inputText: '#78350F',
      inputBorder: '#FCD34D',
      error: '#DC2626',
    },
  },
];

export const ThemeModal: React.FC<Props> = ({ currentColors, onSave, onClose }) => {
  const [colors, setColors] = useState<ThemeColors>({ ...currentColors });

  const handleColorChange = (key: keyof ThemeColors, hexVal: string) => {
    setColors((prev) => ({ ...prev, [key]: hexVal }));
  };

  const handleReset = () => {
    setColors({ ...DEFAULT_THEME_COLORS });
  };

  const handleApplyPreset = (presetColors: Partial<ThemeColors>) => {
    setColors((prev) => ({ ...prev, ...presetColors }));
  };

  const handleSave = () => {
    onSave(colors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Tema ve Renk Paneli</h3>
              <p className="text-[11px] text-gray-500">Tüm arayüz renklerini hex koduyla özelleştirin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Hazır Temalar:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p.colors)}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 whitespace-nowrap shadow-xs transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Color List */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {COLOR_KEYS.map(({ key, label }) => {
            const val = colors[key];
            return (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) => handleColorChange(key, e.target.value.toUpperCase())}
                    className="w-7 h-7 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const v = e.target.value;
                      handleColorChange(key, v);
                    }}
                    onBlur={(e) => {
                      const norm = ThemeService.normalizeHex(e.target.value);
                      if (norm) handleColorChange(key, norm);
                    }}
                    className="w-24 px-2 py-1 rounded-lg border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
            );
          })}
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
