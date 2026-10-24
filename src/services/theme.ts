import { DisplaySettingsState, ThemeColors } from '../types';

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#2F5BEA',
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F4F5F8',
  textPrimary: '#0D0D0D',
  textSecondary: '#5A5A5A',
  toolbar: '#FFFFFF',
  toolbarText: '#0D0D0D',
  divider: '#E3E4E8',
  inputBg: '#FFFFFF',
  inputText: '#0D0D0D',
  inputBorder: '#C9CCD3',
  error: '#C62828',
};

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettingsState = {
  titleSizeSp: 16,
  urlSizeSp: 13,
  folderLabelSizeSp: 12,
  titleColorHex: '',
  urlColorHex: '',
  folderColorHex: '',
  sortingMode: 'CUSTOM',
  faviconEnabled: true,
  showFullFolderPath: false,
  foldersOnTop: true,
  iconPack: 'flaticon',
  customFont: 'system-ui',
};

const STORAGE_THEME = 'yerimlerim_theme_v4';
const STORAGE_DISPLAY = 'yerimlerim_display_v4';

export class ThemeService {
  static getColors(): ThemeColors {
    try {
      const raw = localStorage.getItem(STORAGE_THEME);
      if (raw) return { ...DEFAULT_THEME_COLORS, ...JSON.parse(raw) };
    } catch (e) {
      console.error(e);
    }
    return { ...DEFAULT_THEME_COLORS };
  }

  static setColors(colors: Partial<ThemeColors>): ThemeColors {
    const updated = { ...this.getColors(), ...colors };
    localStorage.setItem(STORAGE_THEME, JSON.stringify(updated));
    this.applyCssVariables(updated);
    return updated;
  }

  static resetColors(): ThemeColors {
    localStorage.removeItem(STORAGE_THEME);
    this.applyCssVariables(DEFAULT_THEME_COLORS);
    return { ...DEFAULT_THEME_COLORS };
  }

  static getDisplaySettings(): DisplaySettingsState {
    try {
      const raw = localStorage.getItem(STORAGE_DISPLAY);
      if (raw) return { ...DEFAULT_DISPLAY_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      console.error(e);
    }
    return { ...DEFAULT_DISPLAY_SETTINGS };
  }

  static setDisplaySettings(settings: Partial<DisplaySettingsState>): DisplaySettingsState {
    const updated = { ...this.getDisplaySettings(), ...settings };
    localStorage.setItem(STORAGE_DISPLAY, JSON.stringify(updated));
    return updated;
  }

  static resetDisplaySettings(): DisplaySettingsState {
    localStorage.removeItem(STORAGE_DISPLAY);
    return { ...DEFAULT_DISPLAY_SETTINGS };
  }

  static applyCssVariables(colors: ThemeColors) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-on-primary', colors.onPrimary);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-toolbar', colors.toolbar);
    root.style.setProperty('--color-toolbar-text', colors.toolbarText);
    root.style.setProperty('--color-divider', colors.divider);
    root.style.setProperty('--color-input-bg', colors.inputBg);
    root.style.setProperty('--color-input-text', colors.inputText);
    root.style.setProperty('--color-input-border', colors.inputBorder);
    root.style.setProperty('--color-error', colors.error);
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.textPrimary;
  }

  static normalizeHex(hex: string): string | null {
    const t = hex.trim();
    if (!t.startsWith('#')) return null;
    if (t.length !== 7 && t.length !== 4) return null;
    const body = t.slice(1);
    if (!/^[0-9a-fA-F]+$/.test(body)) return null;
    if (t.length === 7) return '#' + body.toUpperCase();
    return '#' + body[0] + body[0] + body[1] + body[1] + body[2] + body[2].toUpperCase();
  }
}
