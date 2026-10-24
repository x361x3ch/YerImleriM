import React, { useState, useRef } from 'react';
import { BookmarkEntity, DisplaySettingsState } from '../types';
import {
  MoreVertical,
  GripVertical,
  Globe,
  ExternalLink,
  Edit2,
  Info,
  FolderInput,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';

interface Props {
  bookmark: BookmarkEntity;
  index: number;
  isSelected: boolean;
  isSelectionMode: boolean;
  displaySettings: DisplaySettingsState;
  folderLabel?: string;
  onOpen: (bookmark: BookmarkEntity) => void;
  onToggleSelect: (id: number) => void;
  onEdit: (bookmark: BookmarkEntity) => void;
  onInfo: (bookmark: BookmarkEntity) => void;
  onMove: (bookmark: BookmarkEntity) => void;
  onCopy: (bookmark: BookmarkEntity) => void;
  onDelete: (bookmark: BookmarkEntity) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const BookmarkItem: React.FC<Props> = ({
  bookmark,
  index,
  isSelected,
  isSelectionMode,
  displaySettings,
  folderLabel,
  onOpen,
  onToggleSelect,
  onEdit,
  onInfo,
  onMove,
  onCopy,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faviconLoaded, setFaviconLoaded] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Extract hostname for favicon
  let hostname = '';
  try {
    hostname = new URL(bookmark.url).hostname;
  } catch {
    hostname = '';
  }

  const faviconUrl =
    displaySettings.faviconEnabled && hostname
      ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
      : null;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setMenuOpen(false);
  };

  return (
    <div
      draggable={!isSelectionMode}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onClick={() => {
        if (isSelectionMode) {
          onToggleSelect(bookmark.id);
        } else {
          onOpen(bookmark);
        }
      }}
      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-blue-50/70 border-blue-300 shadow-xs'
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
              onToggleSelect(bookmark.id);
            }}
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        )}

        {/* Favicon or fallback */}
        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {faviconUrl && faviconLoaded ? (
            <img
              src={faviconUrl}
              alt=""
              onError={() => setFaviconLoaded(false)}
              className="w-4 h-4 object-contain"
            />
          ) : (
            <Globe className="w-4 h-4 text-blue-500/70" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pr-2">
          <div
            className="font-medium text-gray-900 truncate leading-snug"
            style={{
              fontSize: `${displaySettings.titleSizeSp}px`,
              color: displaySettings.titleColorHex || undefined,
            }}
          >
            {bookmark.title}
          </div>
          <div
            className="text-gray-400 truncate text-xs font-mono mt-0.5 flex items-center gap-1.5"
            style={{
              fontSize: `${displaySettings.urlSizeSp}px`,
              color: displaySettings.urlColorHex || undefined,
            }}
          >
            <span className="truncate">{bookmark.url}</span>
            {folderLabel && (
              <span
                className="text-[10px] font-sans px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 flex-shrink-0"
                style={{
                  fontSize: `${displaySettings.folderLabelSizeSp}px`,
                  color: displaySettings.folderColorHex || undefined,
                }}
              >
                📁 {folderLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3-dot context menu */}
      <div className="relative flex-shrink-0" ref={menuRef}>
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
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs text-gray-700 animate-fade-in">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                Bağlantıyı Kopyala
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(bookmark);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                Düzenle
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onInfo(bookmark);
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
                  onMove(bookmark);
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
                  onCopy(bookmark);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-700 font-medium"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                Kopyala
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(bookmark);
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
