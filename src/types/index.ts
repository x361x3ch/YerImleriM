export type SortingMode = 'CUSTOM' | 'DATE_DESC' | 'DATE_ASC' | 'NAME_ASC' | 'NAME_DESC';
export type IconPack = 'flaticon' | 'outline' | 'filled' | 'minimal';

export interface BookmarkEntity {
  id: number;
  title: string;
  url: string;
  folderId: number | null;
  sortIndex: number;
  createdAt: number;
  modifiedAt: number;
}

export interface FolderEntity {
  id: number;
  name: string;
  parentId: number | null;
  sortIndex: number;
  createdAt: number;
  modifiedAt: number;
  iconName: string; // 'folder' | 'home' | 'star' | 'heart' | 'book' | 'work' | 'game' | 'shopping' | 'music' | 'movie' | 'food' | 'pet'
  sortMode?: SortingMode;
}

export interface ThemeColors {
  primary: string;
  onPrimary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  toolbar: string;
  toolbarText: string;
  divider: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  error: string;
}

export interface DisplaySettingsState {
  titleSizeSp: number; // 10 to 30
  urlSizeSp: number; // 9 to 24
  folderLabelSizeSp: number; // 9 to 24
  titleColorHex: string;
  urlColorHex: string;
  folderColorHex: string;
  sortingMode: SortingMode;
  faviconEnabled: boolean;
  showFullFolderPath: boolean;
  foldersOnTop: boolean;
  iconPack: IconPack;
  customFont: string;
}

export interface InScreenActionState {
  type: 'move' | 'copy' | 'add' | 'share';
  bookmarkIds?: number[];
  folderIds?: number[];
  addData?: {
    title: string;
    url: string;
  };
}
