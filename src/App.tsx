import React, { useState, useEffect, useMemo } from 'react';
import {
  BookmarkEntity,
  FolderEntity,
  SortingMode,
  InScreenActionState,
  ThemeColors,
  DisplaySettingsState,
} from './types';
import { DatabaseService } from './services/db';
import { ThemeService } from './services/theme';
import { openUrl, registerBackButton, setupStatusBar } from './services/platform';
import { Toolbar } from './components/Toolbar';
import { Breadcrumb } from './components/Breadcrumb';
import { InScreenPickerBanner } from './components/InScreenPickerBanner';
import { BookmarkItem } from './components/BookmarkItem';
import { FolderItem } from './components/FolderItem';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { NewFolderModal } from './components/NewFolderModal';
import { EditDialog } from './components/EditDialog';
import { InfoDialog } from './components/InfoDialog';
import { IconPickerDialog } from './components/IconPickerDialog';
import { SortDialog } from './components/SortDialog';
import { SettingsModal } from './components/SettingsModal';
import { ThemeModal } from './components/ThemeModal';
import { ImportExportModal } from './components/ImportExportModal';
import { SimulateShareModal } from './components/SimulateShareModal';
import { FolderPlus, Plus, BookmarkX, CheckCircle } from 'lucide-react';

export default function App() {
  const [folders, setFolders] = useState<FolderEntity[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkEntity[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [themeColors, setThemeColors] = useState<ThemeColors>(ThemeService.getColors());
  const [displaySettings, setDisplaySettings] = useState<DisplaySettingsState>(
    ThemeService.getDisplaySettings()
  );

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<number[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);

  const [inScreenAction, setInScreenAction] = useState<InScreenActionState | null>(null);

  const [addBookmarkOpen, setAddBookmarkOpen] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [simulateShareOpen, setSimulateShareOpen] = useState(false);
  const [importExportModal, setImportExportModal] = useState<{
    open: boolean;
    tab: 'import' | 'export';
  }>({ open: false, tab: 'import' });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    isFolder: boolean;
    item?: BookmarkEntity | FolderEntity;
  }>({ open: false, isFolder: false });
  const [infoModal, setInfoModal] = useState<{
    open: boolean;
    isFolder: boolean;
    item?: BookmarkEntity | FolderEntity;
  }>({ open: false, isFolder: false });
  const [iconPickerModal, setIconPickerModal] = useState<{
    open: boolean;
    folder?: FolderEntity;
  }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: 'single_bookmark' | 'single_folder' | 'selection';
    targetBm?: BookmarkEntity;
    targetFolder?: FolderEntity;
  }>({ open: false, type: 'selection' });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  useEffect(() => {
    setFolders(DatabaseService.getAllFolders());
    setBookmarks(DatabaseService.getAllBookmarks());
    ThemeService.applyCssVariables(themeColors);
  }, []);

  useEffect(() => {
    const isDark = isColorDark(themeColors.background);
    setupStatusBar(themeColors.primary, isDark).catch(() => {});
  }, [themeColors.primary, themeColors.background]);

  useEffect(() => {
    const cleanup = registerBackButton(() => {
      if (deleteModal.open) { setDeleteModal({ open: false, type: 'selection' }); return true; }
      if (editModal.open) { setEditModal({ open: false, isFolder: false }); return true; }
      if (infoModal.open) { setInfoModal({ open: false, isFolder: false }); return true; }
      if (iconPickerModal.open) { setIconPickerModal({ open: false }); return true; }
      if (sortOpen) { setSortOpen(false); return true; }
      if (themeOpen) { setThemeOpen(false); return true; }
      if (settingsOpen) { setSettingsOpen(false); return true; }
      if (simulateShareOpen) { setSimulateShareOpen(false); return true; }
      if (importExportModal.open) { setImportExportModal({ open: false, tab: 'import' }); return true; }
      if (addBookmarkOpen) { setAddBookmarkOpen(false); return true; }
      if (newFolderOpen) { setNewFolderOpen(false); return true; }

      if (inScreenAction) { setInScreenAction(null); return true; }
      if (isSelectionMode) { handleCancelSelection(); return true; }
      if (searchQuery) { setSearchQuery(''); return true; }

      if (currentFolderId !== null) {
        const current = folders.find((f) => f.id === currentFolderId);
        setCurrentFolderId(current?.parentId ?? null);
        return true;
      }

      return false;
    });

    return () => {
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentFolderId,
    folders,
    deleteModal.open,
    editModal.open,
    infoModal.open,
    iconPickerModal.open,
    sortOpen,
    themeOpen,
    settingsOpen,
    simulateShareOpen,
    importExportModal.open,
    addBookmarkOpen,
    newFolderOpen,
    inScreenAction,
    isSelectionMode,
    searchQuery,
  ]);

  const refreshData = () => {
    setFolders(DatabaseService.getAllFolders());
    setBookmarks(DatabaseService.getAllBookmarks());
  };

  const currentFolder = useMemo(() => {
    return currentFolderId !== null ? folders.find((f) => f.id === currentFolderId) || null : null;
  }, [folders, currentFolderId]);

  const activeSortMode: SortingMode = useMemo(() => {
    if (currentFolder && currentFolder.sortMode) {
      return currentFolder.sortMode;
    }
    return displaySettings.sortingMode;
  }, [currentFolder, displaySettings.sortingMode]);

  const breadcrumbPathString = useMemo(() => {
    if (currentFolderId === null) return 'Kök Dizin';
    const chain: string[] = [];
    let cur: number | null = currentFolderId;
    const visited = new Set<number>();
    while (cur !== null && !visited.has(cur)) {
      visited.add(cur);
      const f = folders.find((x) => x.id === cur);
      if (!f) break;
      chain.unshift(f.name);
      cur = f.parentId;
    }
    return 'Kök › ' + chain.join(' › ');
  }, [currentFolderId, folders]);

  const compareItems = (a: any, b: any, mode: SortingMode) => {
    const aName = (a.title || a.name || '').toLowerCase();
    const bName = (b.title || b.name || '').toLowerCase();

    switch (mode) {
      case 'NAME_ASC':
        return aName.localeCompare(bName, 'tr');
      case 'NAME_DESC':
        return bName.localeCompare(aName, 'tr');
      case 'DATE_DESC':
        return (b.createdAt || 0) - (a.createdAt || 0);
      case 'DATE_ASC':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case 'CUSTOM':
      default:
        return (a.sortIndex ?? 0) - (b.sortIndex ?? 0);
    }
  };

  const { displayFolders, displayBookmarks, unifiedList } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const matchedBms = bookmarks.filter(
        (b) => b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query)
      );
      const matchedFolders = folders.filter((f) => f.name.toLowerCase().includes(query));

      const sortedBms = [...matchedBms].sort((a, b) => compareItems(a, b, activeSortMode));
      const sortedFolders = [...matchedFolders].sort((a, b) => compareItems(a, b, activeSortMode));

      const unified = [
        ...sortedFolders.map((f) => ({ ...f, itemType: 'folder' as const })),
        ...sortedBms.map((b) => ({ ...b, itemType: 'bookmark' as const })),
      ].sort((a, b) => compareItems(a, b, activeSortMode));

      return {
        displayFolders: sortedFolders,
        displayBookmarks: sortedBms,
        unifiedList: unified,
      };
    }

    const fChildren = folders.filter((f) => f.parentId === currentFolderId);
    const bChildren = bookmarks.filter((b) => b.folderId === currentFolderId);

    const sortedFolders = [...fChildren].sort((a, b) => compareItems(a, b, activeSortMode));
    const sortedBms = [...bChildren].sort((a, b) => compareItems(a, b, activeSortMode));

    if (displaySettings.foldersOnTop) {
      const unified = [
        ...sortedFolders.map((f) => ({ ...f, itemType: 'folder' as const })),
        ...sortedBms.map((b) => ({ ...b, itemType: 'bookmark' as const })),
      ];
      return {
        displayFolders: sortedFolders,
        displayBookmarks: sortedBms,
        unifiedList: unified,
      };
    } else {
      const combined = [
        ...fChildren.map((f) => ({ ...f, itemType: 'folder' as const })),
        ...bChildren.map((b) => ({ ...b, itemType: 'bookmark' as const })),
      ].sort((a, b) => compareItems(a, b, activeSortMode));

      return {
        displayFolders: sortedFolders,
        displayBookmarks: sortedBms,
        unifiedList: combined,
      };
    }
  }, [folders, bookmarks, currentFolderId, searchQuery, activeSortMode, displaySettings.foldersOnTop]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const items = [...unifiedList];
    const [moved] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, moved);

    const orderedItems = items.map((i) => ({
      id: i.id,
      type: i.itemType,
    }));

    DatabaseService.reorderItems(currentFolderId, orderedItems);
    refreshData();
    setDraggedIndex(null);

    if (activeSortMode !== 'CUSTOM') {
      if (currentFolderId !== null) {
        DatabaseService.setFolderSortMode(currentFolderId, 'CUSTOM');
      } else {
        const updated = ThemeService.setDisplaySettings({ sortingMode: 'CUSTOM' });
        setDisplaySettings(updated);
      }
      refreshData();
      showToast('Sıralama "Özel" moda alındı ve yeni yerleşim kaydedildi.');
    } else {
      showToast('Yeni sıralama kaydedildi.');
    }
  };

  const handleToggleSelectBookmark = (id: number) => {
    setSelectedBookmarkIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      if (next.length === 0 && selectedFolderIds.length === 0) {
        setIsSelectionMode(false);
      } else {
        setIsSelectionMode(true);
      }
      return next;
    });
  };

  const handleToggleSelectFolder = (id: number) => {
    setSelectedFolderIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      if (next.length === 0 && selectedBookmarkIds.length === 0) {
        setIsSelectionMode(false);
      } else {
        setIsSelectionMode(true);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allBmIds = displayBookmarks.map((b) => b.id);
    const allFolderIds = displayFolders.map((f) => f.id);
    setSelectedBookmarkIds(allBmIds);
    setSelectedFolderIds(allFolderIds);
    setIsSelectionMode(true);
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedBookmarkIds([]);
    setSelectedFolderIds([]);
  };

  const handleStartMoveInScreen = (bmIds?: number[], folderIds?: number[]) => {
    const bms = bmIds || selectedBookmarkIds;
    const flds = folderIds || selectedFolderIds;
    if (bms.length === 0 && flds.length === 0) return;

    setInScreenAction({
      type: 'move',
      bookmarkIds: bms,
      folderIds: flds,
    });
    handleCancelSelection();
    showToast('Taşıma Modu aktif: Hedef klasöre gidin ve "Buraya Taşı"ya tıklayın.');
  };

  const handleStartCopyInScreen = (bmIds?: number[], folderIds?: number[]) => {
    const bms = bmIds || selectedBookmarkIds;
    const flds = folderIds || selectedFolderIds;
    if (bms.length === 0 && flds.length === 0) return;

    setInScreenAction({
      type: 'copy',
      bookmarkIds: bms,
      folderIds: flds
