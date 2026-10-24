import React from 'react';
import {
  Search,
  X,
  CheckSquare,
  Trash2,
  FolderInput,
  Copy,
  Download,
  Palette,
  Sliders,
  ArrowDownUp,
  Plus,
  FolderPlus,
  Share2,
} from 'lucide-react';

interface Props {
  isSelectionMode: boolean;
  selectedCount: number;
  totalSelectableCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCancelSelection: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onMoveSelected: () => void;
  onCopySelected: () => void;
  onExportSelected: () => void;
  onOpenAddBookmark: () => void;
  onOpenNewFolder: () => void;
  onOpenSort: () => void;
  onOpenTheme: () => void;
  onOpenSettings: () => void;
  onOpenSimulateShare: () => void;
}

export const Toolbar: React.FC<Props> = ({
  isSelectionMode,
  selectedCount,
  totalSelectableCount,
  searchQuery,
  onSearchChange,
  onCancelSelection,
  onSelectAll,
  onDeleteSelected,
  onMoveSelected,
  onCopySelected,
  onExportSelected,
  onOpenAddBookmark,
  onOpenNewFolder,
  onOpenSort,
  onOpenTheme,
  onOpenSettings,
  onOpenSimulateShare,
}) => {
  if (isSelectionMode) {
    return (
      <header className="sticky top-0 z-30 bg-blue-600 text-white shadow-md transition-all">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Left: Cancel & Count */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancelSelection}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="Seçimden Çık"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm tracking-wide">
              {selectedCount} seçili
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg hover:bg-white/20 transition-colors text-xs font-medium flex items-center gap-1"
              title="Tümünü Seç"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tümünü Seç</span>
            </button>

            <button
              type="button"
              onClick={onMoveSelected}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-xs font-medium flex items-center gap-1"
              title="Taşı (Ana Ekranda)"
            >
              <FolderInput className="w-4 h-4" />
              <span className="hidden sm:inline">Taşı</span>
            </button>

            <button
              type="button"
              onClick={onCopySelected}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-xs font-medium flex items-center gap-1"
              title="Kopyala"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Kopyala</span>
            </button>

            <button
              type="button"
              onClick={onExportSelected}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg hover:bg-white/20 transition-colors text-xs font-medium flex items-center gap-1"
              title="Dışa Aktar"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Dışa Aktar</span>
            </button>

            <button
              type="button"
              onClick={onDeleteSelected}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg hover:bg-red-500/80 transition-colors text-xs font-medium flex items-center gap-1 text-red-100 hover:text-white"
              title="Sil"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Sil</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 space-y-2.5">
        {/* Top row: Brand & Tool icons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              YM
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">Yer İmleri M</h1>
              <p className="text-[10px] text-gray-400 font-medium">Hızlı, Sade ve Güçlü</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenSimulateShare}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Paylaşım Menüsü Simülatörü"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSort}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Sıralama Ayarları"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenTheme}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Tema Paneli"
            >
              <Palette className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Ayarlar & İçe/Dışa Aktar"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom row: Search & Add Buttons */}
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Yer imlerinde ara…"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-100/80 border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none text-xs text-gray-800 transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* New Folder Button */}
          <button
            type="button"
            onClick={onOpenNewFolder}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors flex-shrink-0"
            title="Yeni Klasör Ekle"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Yeni Klasör</span>
          </button>

          {/* Add Bookmark Button */}
          <button
            type="button"
            onClick={onOpenAddBookmark}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0"
            title="Yer İmi Ekle"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
