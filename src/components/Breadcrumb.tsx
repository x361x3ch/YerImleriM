import React from 'react';
import { FolderEntity, SortingMode } from '../types';
import { ChevronRight, Home, ArrowDownUp } from 'lucide-react';

interface Props {
  currentFolderId: number | null;
  allFolders: FolderEntity[];
  currentSortMode: SortingMode;
  onNavigate: (folderId: number | null) => void;
  onOpenSort: () => void;
}

export const Breadcrumb: React.FC<Props> = ({
  currentFolderId,
  allFolders,
  currentSortMode,
  onNavigate,
  onOpenSort,
}) => {
  // Build folder chain from root to current folder
  const folderMap = new Map(allFolders.map((f) => [f.id, f]));
  const chain: FolderEntity[] = [];
  let cur = currentFolderId;
  const visited = new Set<number>();

  while (cur !== null && !visited.has(cur)) {
    visited.add(cur);
    const f = folderMap.get(cur);
    if (!f) break;
    chain.unshift(f);
    cur = f.parentId;
  }

  const getSortLabel = (mode: SortingMode) => {
    switch (mode) {
      case 'CUSTOM':
        return 'Özel';
      case 'NAME_ASC':
        return 'A→Z';
      case 'NAME_DESC':
        return 'Z→A';
      case 'DATE_DESC':
        return 'Yeni→Eski';
      case 'DATE_ASC':
        return 'Eski→Yeni';
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50/60 overflow-x-auto text-xs">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-1 min-w-0 flex-1 whitespace-nowrap overflow-x-auto py-0.5">
        <button
          type="button"
          onClick={() => onNavigate(null)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors ${
            currentFolderId === null
              ? 'bg-blue-100/80 text-blue-700 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Kök</span>
        </button>

        {chain.map((f, i) => {
          const isLast = i === chain.length - 1;
          return (
            <React.Fragment key={f.id}>
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <button
                type="button"
                onClick={() => onNavigate(f.id)}
                className={`px-2 py-1 rounded-md font-medium transition-colors truncate max-w-[140px] ${
                  isLast
                    ? 'bg-blue-100/80 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
                title={f.name}
              >
                {f.name}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Sort mode indicator button */}
      <button
        type="button"
        onClick={onOpenSort}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 shadow-2xs text-[11px] font-medium flex-shrink-0 transition-colors"
        title="Sıralama modunu değiştir"
      >
        <ArrowDownUp className="w-3 h-3 text-blue-600" />
        <span className="hidden sm:inline text-gray-500">Sıralama:</span>
        <span className="font-semibold text-gray-800">{getSortLabel(currentSortMode)}</span>
      </button>
    </div>
  );
};
