import React, { useState, useRef } from 'react';
import { FolderEntity, DisplaySettingsState } from '../types';
import { Flaticon } from '../icons/Flaticons';
import {
  MoreVertical,
  GripVertical,
  Edit2,
  Smile,
  LogOut,
  Info,
  FolderInput,
  Copy,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react';

interface Props {
  folder: FolderEntity;
  index: number;
  isSelected: boolean;
  isSelectionMode: boolean;
  displaySettings: DisplaySettingsState;
  childFolderCount: number;
  childBookmarkCount: number;
  onOpen: (folder: FolderEntity) => void;
  onToggleSelect: (id: number) => void;
  onEdit: (folder: FolderEntity) => void;
  onChooseIcon: (folder: FolderEntity) => void;
  onExtract: (folder: FolderEntity) => void;
  onInfo: (folder: FolderEntity) => void;
  onMove: (folder: FolderEntity) => void;
  onCopy: (folder: FolderEntity) => void;
  onDelete: (folder: FolderEntity) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const FolderItem: React.FC<Props> = ({
  folder,
  index,
  isSelected,
  isSelectionMode,
  displaySettings,
  childFolderCount,
  childBookmarkCount,
  onOpen,
  onToggleSelect,
  onEdit,
  onChooseIcon,
  onExtract,
  onInfo,
  onMove,
  onCopy,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div
      draggable={!isSelectionMode}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onClick={() => {
        if (isSelectionMode) {
          onToggleSelect(folder.id);
        } else {
          onOpen(folder);
        }
      }}
      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-amber-50/70 border-amber-300 shadow-xs'
          : 'bg-white hover:bg-gray-50/80 border-gray-100/80 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Drag handle */}
        {!isSelectionMode && (
          <div
            className="text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing p-0.5 -ml-1 transition-colors"
            title="Sürükleyip sıralayın"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
        )}

        {/* Checkbox */}
        {isSelectionMode && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(folder.id);
            }}
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-amber-600 border-amber-600 text-white'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        )}

        {/* Flaticon folder icon */}
        <div className="w-8 h-8 rounded-lg bg-amber-50/60 flex items-center justify-center flex-shrink-0">
          <Flaticon
            name={folder.iconName || 'folder'}
            pack={displaySettings.iconPack}
            size={22}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pr-2">
          <div
            className="font-semibold text-gray-900 truncate leading-snug flex items-center gap-1.5"
            style={{
              fontSize: `${displaySettings.titleSizeSp}px`,
              color: displaySettings.folderColorHex || undefined,
            }}
          >
            <span>{folder.name}</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
            <span>{childFolderCount} alt klasör</span>
            <span>•</span>
            <span>{childBookmarkCount} yer imi</span>
            {folder.sortMode && folder.sortMode !== 'CUSTOM' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-mono">
                {folder.sortMode === 'NAME_ASC'
                  ? 'A→Z'
                  : folder.sortMode === 'NAME_DESC'
                  ? 'Z→A'
                  : folder.sortMode === 'DATE_DESC'
                  ? 'Yeni'
                  : 'Eski'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right chevron & 3-dot context menu */}
      <div className="flex items-center gap-1 flex-shrink-0" ref={menuRef}>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs text-gray-700 animate-fade-in">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                Yeniden Adlandır
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onChooseIcon(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-700 font-medium"
              >
                <Smile className="w-3.5 h-3.5 text-blue-600" />
                İkon Seç (Flaticon)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onExtract(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-purple-700 font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-purple-600" />
                Klasörden Çıkar (Dışa aktar)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onInfo(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Info className="w-3.5 h-3.5 text-gray-500" />
                Bilgi
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onMove(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-amber-700 font-medium"
              >
                <FolderInput className="w-3.5 h-3.5 text-amber-600" />
                Taşı (Ana Ekranda)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onCopy(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-700 font-medium"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                Kopyala (Alt klasörlerle)
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(folder);
                }}
                className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
