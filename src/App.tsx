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
import { FolderPlus, Plus, BookmarkX, CheckCircle, Info } from 'lucide-react';

export default function App() {
  // Database State
  const [folders, setFolders] = useState<FolderEntity[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkEntity[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Theming & Display Settings
  const [themeColors, setThemeColors] = useState<ThemeColors>(ThemeService.getColors());
  const [displaySettings, setDisplaySettings] = useState<DisplaySettingsState>(
    ThemeService.getDisplaySettings()
  );

  // Multi-Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<number[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);

  // In-Screen Navigation Action (for Add, Move, Copy, Share)
  const [inScreenAction, setInScreenAction] = useState<InScreenActionState | null>(null);

  // Modals State
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

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Initial load
  useEffect(() => {
    setFolders(DatabaseService.getAllFolders());
    setBookmarks(DatabaseService.getAllBookmarks());
    ThemeService.applyCssVariables(themeColors);
  }, []);

  const refreshData = () => {
    setFolders(DatabaseService.getAllFolders());
    setBookmarks(DatabaseService.getAllBookmarks());
  };

  // Current active folder object
  const currentFolder = useMemo(() => {
    return currentFolderId !== null ? folders.find((f) => f.id === currentFolderId) || null : null;
  }, [folders, currentFolderId]);

  // Current active sort mode (folder-specific or global)
  const activeSortMode: SortingMode = useMemo(() => {
    if (currentFolder && currentFolder.sortMode) {
      return currentFolder.sortMode;
    }
    return displaySettings.sortingMode;
  }, [currentFolder, displaySettings.sortingMode]);

  // Breadcrumb path string (for InScreenPickerBanner)
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

  // Sort helper function
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

  // Items for the current view (Search or Folder View)
  const { displayFolders, displayBookmarks, unifiedList } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      // Search mode: returns all matching bookmarks and folders across the app
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

    // Normal folder view
    const fChildren = folders.filter((f) => f.parentId === currentFolderId);
    const bChildren = bookmarks.filter((b) => b.folderId === currentFolderId);

    const sortedFolders = [...fChildren].sort((a, b) => compareItems(a, b, activeSortMode));
    const sortedBms = [...bChildren].sort((a, b) => compareItems(a, b, activeSortMode));

    if (displaySettings.foldersOnTop) {
      // Folders on top: Folders first, bookmarks second
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
      // Folders treated in-line like links according to active sort mode!
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

  // Drag and drop reordering
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

    // Clone the displayed list
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

    // If active sort mode was not CUSTOM, inform user that it has switched to CUSTOM
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

  // Selection Mode Handlers
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

  // In-Screen Mode Starters
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
      folderIds: flds,
    });
    handleCancelSelection();
    showToast('Kopyalama Modu aktif: Hedef klasöre gidin ve "Buraya Kopyala"ya tıklayın.');
  };

  const handleStartAddInScreen = (title: string, url: string) => {
    setInScreenAction({
      type: 'add',
      addData: { title, url },
    });
    showToast('Ekleme Modu aktif: Hedef klasöre gidin ve "Buraya Ekle"ye tıklayın.');
  };

  const handleStartShareInScreen = (title: string, url: string) => {
    setInScreenAction({
      type: 'share',
      addData: { title, url },
    });
    showToast('Paylaşım Modu aktif: Hedef klasöre gidin ve "Buraya Kaydet"e tıklayın.');
  };

  // In-Screen Mode Confirm
  const handleConfirmInScreenAction = () => {
    if (!inScreenAction) return;

    if (inScreenAction.type === 'move') {
      DatabaseService.moveItems(
        inScreenAction.bookmarkIds || [],
        inScreenAction.folderIds || [],
        currentFolderId
      );
      showToast('Ögeler hedef klasöre taşındı.');
    } else if (inScreenAction.type === 'copy') {
      DatabaseService.copyItems(
        inScreenAction.bookmarkIds || [],
        inScreenAction.folderIds || [],
        currentFolderId
      );
      showToast('Ögeler hedef klasöre kopyalandı.');
    } else if (inScreenAction.type === 'add' || inScreenAction.type === 'share') {
      if (inScreenAction.addData) {
        DatabaseService.addBookmark(
          inScreenAction.addData.title,
          inScreenAction.addData.url,
          currentFolderId
        );
        showToast('Yer imi başarıyla kaydedildi.');
      }
    }

    setInScreenAction(null);
    refreshData();
  };

  // Delete Confirm Execution
  const handleExecuteDelete = () => {
    if (deleteModal.type === 'single_bookmark' && deleteModal.targetBm) {
      DatabaseService.deleteBookmark(deleteModal.targetBm.id);
      showToast(`"${deleteModal.targetBm.title}" silindi.`);
    } else if (deleteModal.type === 'single_folder' && deleteModal.targetFolder) {
      DatabaseService.deleteFolder(deleteModal.targetFolder.id);
      showToast(`"${deleteModal.targetFolder.name}" klasörü ve içeriği silindi.`);
    } else if (deleteModal.type === 'selection') {
      DatabaseService.deleteMultiple(selectedBookmarkIds, selectedFolderIds);
      showToast(`${selectedBookmarkIds.length + selectedFolderIds.length} öge silindi.`);
      handleCancelSelection();
    }
    setDeleteModal({ open: false, type: 'selection' });
    refreshData();
  };

  // Folder helper displayName
  const getFolderDisplayName = (folderId: number | null): string => {
    if (folderId === null) return '';
    const f = folders.find((x) => x.id === folderId);
    if (!f) return '';
    if (!displaySettings.showFullFolderPath) return f.name;

    const chain: string[] = [];
    let cur: number | null = folderId;
    const visited = new Set<number>();
    while (cur !== null && !visited.has(cur)) {
      visited.add(cur);
      const curFolder = folders.find((x) => x.id === cur);
      if (!curFolder) break;
      chain.unshift(curFolder.name);
      cur = curFolder.parentId;
    }
    return chain.join(' / ');
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors pb-16"
      style={{
        fontFamily: displaySettings.customFont,
        backgroundColor: themeColors.background,
        color: themeColors.textPrimary,
      }}
    >
      {/* Active In-Screen Banner (Add, Move, Copy, Share) */}
      {inScreenAction && (
        <InScreenPickerBanner
          actionState={inScreenAction}
          currentFolder={currentFolder}
          breadcrumbPath={breadcrumbPathString}
          onConfirm={handleConfirmInScreenAction}
          onCancel={() => setInScreenAction(null)}
        />
      )}

      {/* Main Toolbar / Multi-Select Action Bar */}
      <Toolbar
        isSelectionMode={isSelectionMode}
        selectedCount={selectedBookmarkIds.length + selectedFolderIds.length}
        totalSelectableCount={displayBookmarks.length + displayFolders.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCancelSelection={handleCancelSelection}
        onSelectAll={handleSelectAll}
        onDeleteSelected={() => setDeleteModal({ open: true, type: 'selection' })}
        onMoveSelected={() => handleStartMoveInScreen()}
        onCopySelected={() => handleStartCopyInScreen()}
        onExportSelected={() => setImportExportModal({ open: true, tab: 'export' })}
        onOpenAddBookmark={() => setAddBookmarkOpen(true)}
        onOpenNewFolder={() => setNewFolderOpen(true)}
        onOpenSort={() => setSortOpen(true)}
        onOpenTheme={() => setThemeOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSimulateShare={() => setSimulateShareOpen(true)}
      />

      {/* Breadcrumb Bar */}
      {!searchQuery && (
        <Breadcrumb
          currentFolderId={currentFolderId}
          allFolders={folders}
          currentSortMode={activeSortMode}
          onNavigate={(id) => setCurrentFolderId(id)}
          onOpenSort={() => setSortOpen(true)}
        />
      )}

      {/* Search Bar Info banner */}
      {searchQuery && (
        <div className="bg-blue-50/60 border-b border-blue-100 px-4 py-2 text-xs text-blue-800 flex items-center justify-between">
          <span>
            <strong>"{searchQuery}"</strong> için arama sonuçları: {displayBookmarks.length} yer imi,{' '}
            {displayFolders.length} klasör
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Aramayı Temizle
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-3 flex-1">
        {unifiedList.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
              <BookmarkX className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Henüz yer imi yok</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
              Üstteki <strong>+ Ekle</strong> butonuyla yeni bir yer imi ekleyin veya dosya içe aktarın.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setAddBookmarkOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Yer İmi Ekle
              </button>
              <button
                type="button"
                onClick={() => setNewFolderOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                Yeni Klasör
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {unifiedList.map((item, index) => {
              if (item.itemType === 'folder') {
                const f = item as FolderEntity;
                const stats = DatabaseService.getRecursiveStats(f.id);
                return (
                  <FolderItem
                    key={`folder-${f.id}`}
                    folder={f}
                    index={index}
                    isSelected={selectedFolderIds.includes(f.id)}
                    isSelectionMode={isSelectionMode}
                    displaySettings={displaySettings}
                    childFolderCount={stats.folderCount}
                    childBookmarkCount={stats.bookmarkCount}
                    onOpen={(folder) => {
                      setCurrentFolderId(folder.id);
                      setSearchQuery('');
                    }}
                    onToggleSelect={handleToggleSelectFolder}
                    onEdit={(folder) => setEditModal({ open: true, isFolder: true, item: folder })}
                    onChooseIcon={(folder) => setIconPickerModal({ open: true, folder })}
                    onExtract={(folder) => {
                      DatabaseService.extractFolder(folder.id);
                      refreshData();
                      showToast(`"${folder.name}" içeriği üst klasöre çıkarıldı.`);
                    }}
                    onInfo={(folder) => setInfoModal({ open: true, isFolder: true, item: folder })}
                    onMove={(folder) => handleStartMoveInScreen([], [folder.id])}
                    onCopy={(folder) => handleStartCopyInScreen([], [folder.id])}
                    onDelete={(folder) =>
                      setDeleteModal({
                        open: true,
                        type: 'single_folder',
                        targetFolder: folder,
                      })
                    }
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                );
              } else {
                const b = item as BookmarkEntity;
                return (
                  <BookmarkItem
                    key={`bm-${b.id}`}
                    bookmark={b}
                    index={index}
                    isSelected={selectedBookmarkIds.includes(b.id)}
                    isSelectionMode={isSelectionMode}
                    displaySettings={displaySettings}
                    folderLabel={getFolderDisplayName(b.folderId)}
                    onOpen={(bm) => window.open(bm.url, '_blank')}
                    onToggleSelect={handleToggleSelectBookmark}
                    onEdit={(bm) => setEditModal({ open: true, isFolder: false, item: bm })}
                    onInfo={(bm) => setInfoModal({ open: true, isFolder: false, item: bm })}
                    onMove={(bm) => handleStartMoveInScreen([bm.id], [])}
                    onCopy={(bm) => handleStartCopyInScreen([bm.id], [])}
                    onDelete={(bm) =>
                      setDeleteModal({
                        open: true,
                        type: 'single_bookmark',
                        targetBm: bm,
                      })
                    }
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                );
              }
            })}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-sm text-xs font-medium flex items-center gap-2 animate-fade-in border border-gray-700/50">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      {addBookmarkOpen && (
        <AddBookmarkModal
          currentFolderId={currentFolderId}
          allFolders={folders}
          onSave={(title, url, folderId) => {
            DatabaseService.addBookmark(title, url, folderId);
            refreshData();
            showToast('Yer imi eklendi.');
          }}
          onStartInScreenPick={handleStartAddInScreen}
          onClose={() => setAddBookmarkOpen(false)}
        />
      )}

      {newFolderOpen && (
        <NewFolderModal
          currentFolderId={currentFolderId}
          allFolders={folders}
          iconPack={displaySettings.iconPack}
          onSave={(name, parentId, iconName) => {
            DatabaseService.addFolder(name, parentId, iconName);
            refreshData();
            showToast('Yeni klasör oluşturuldu.');
          }}
          onClose={() => setNewFolderOpen(false)}
        />
      )}

      {sortOpen && (
        <SortDialog
          currentFolder={currentFolder}
          currentSortMode={activeSortMode}
          foldersOnTop={displaySettings.foldersOnTop}
          onSelectSortMode={(mode) => {
            if (currentFolderId !== null) {
              DatabaseService.setFolderSortMode(currentFolderId, mode);
              showToast(`"${currentFolder?.name}" için sıralama güncellendi.`);
            } else {
              const updated = ThemeService.setDisplaySettings({ sortingMode: mode });
              setDisplaySettings(updated);
              showToast('Genel sıralama güncellendi.');
            }
            refreshData();
          }}
          onToggleFoldersOnTop={(val) => {
            const updated = ThemeService.setDisplaySettings({ foldersOnTop: val });
            setDisplaySettings(updated);
            showToast(val ? 'Klasörler üstte gruplanıyor.' : 'Klasörler liste içinde sıralanıyor.');
          }}
          onClose={() => setSortOpen(false)}
        />
      )}

      {themeOpen && (
        <ThemeModal
          currentColors={themeColors}
          onSave={(colors) => {
            const updated = ThemeService.setColors(colors);
            setThemeColors(updated);
            showToast('Tema renkleri kaydedildi.');
          }}
          onClose={() => setThemeOpen(false)}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          currentSettings={displaySettings}
          onSave={(settings) => {
            const updated = ThemeService.setDisplaySettings(settings);
            setDisplaySettings(updated);
            showToast('Ayarlar kaydedildi.');
          }}
          onOpenImportExport={(tab) => {
            setImportExportModal({ open: true, tab });
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {importExportModal.open && (
        <ImportExportModal
          initialTab={importExportModal.tab}
          allFolders={folders}
          allBookmarks={bookmarks}
          selectedBookmarkIds={selectedBookmarkIds}
          selectedFolderIds={selectedFolderIds}
          onImportSuccess={(newFolders, newBookmarks, mode) => {
            if (mode === 'replace') {
              DatabaseService.replaceAll(newFolders, newBookmarks);
            } else {
              DatabaseService.insertBatch(newFolders, newBookmarks);
            }
            refreshData();
            showToast('İçe aktarma başarıyla tamamlandı!');
          }}
          onClose={() => setImportExportModal({ open: false, tab: 'import' })}
        />
      )}

      {simulateShareOpen && (
        <SimulateShareModal
          onStartShare={handleStartShareInScreen}
          onClose={() => setSimulateShareOpen(false)}
        />
      )}

      {editModal.open && editModal.item && (
        <EditDialog
          initialTitle={(editModal.item as any).title || (editModal.item as any).name}
          initialUrl={(editModal.item as any).url}
          isFolder={editModal.isFolder}
          onSave={(newTitle, newUrl) => {
            if (editModal.isFolder) {
              DatabaseService.updateFolder({
                ...(editModal.item as FolderEntity),
                name: newTitle,
              });
              showToast('Klasör güncellendi.');
            } else {
              DatabaseService.updateBookmark({
                ...(editModal.item as BookmarkEntity),
                title: newTitle,
                url: newUrl || (editModal.item as BookmarkEntity).url,
              });
              showToast('Yer imi güncellendi.');
            }
            refreshData();
          }}
          onClose={() => setEditModal({ open: false, isFolder: false })}
        />
      )}

      {infoModal.open && infoModal.item && (
        <InfoDialog
          title={(infoModal.item as any).title || (infoModal.item as any).name}
          url={(infoModal.item as any).url}
          folderPath={getFolderDisplayName(
            infoModal.isFolder
              ? (infoModal.item as FolderEntity).parentId
              : (infoModal.item as BookmarkEntity).folderId
          )}
          createdAt={infoModal.item.createdAt}
          modifiedAt={infoModal.item.modifiedAt}
          isFolder={infoModal.isFolder}
          subfolderCount={
            infoModal.isFolder ? DatabaseService.getRecursiveStats(infoModal.item.id).folderCount : 0
          }
          bookmarkCount={
            infoModal.isFolder
              ? DatabaseService.getRecursiveStats(infoModal.item.id).bookmarkCount
              : 0
          }
          onClose={() => setInfoModal({ open: false, isFolder: false })}
        />
      )}

      {iconPickerModal.open && iconPickerModal.folder && (
        <IconPickerDialog
          currentIcon={iconPickerModal.folder.iconName || 'folder'}
          iconPack={displaySettings.iconPack}
          onSelect={(iconName) => {
            DatabaseService.updateFolder({
              ...iconPickerModal.folder!,
              iconName,
            });
            refreshData();
            showToast('Klasör simgesi güncellendi.');
          }}
          onClose={() => setIconPickerModal({ open: false })}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm">Silme Onayı</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {deleteModal.type === 'single_folder'
                ? `"${deleteModal.targetFolder?.name}" klasörünü ve içindeki tüm alt klasör ve yer imlerini silmek istediğinize emin misiniz?`
                : deleteModal.type === 'single_bookmark'
                ? `"${deleteModal.targetBm?.title}" yer imini silmek istediğinize emin misiniz?`
                : `${
                    selectedBookmarkIds.length + selectedFolderIds.length
                  } seçili ögeyi silmek istediğinize emin misiniz?`}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, type: 'selection' })}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-all"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
