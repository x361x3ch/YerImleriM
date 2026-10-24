import { BookmarkEntity, FolderEntity, SortingMode } from '../types';

const STORAGE_KEY_BOOKMARKS = 'yerimlerim_bookmarks_v4';
const STORAGE_KEY_FOLDERS = 'yerimlerim_folders_v4';

const INITIAL_FOLDERS: FolderEntity[] = [
  {
    id: 1,
    name: 'Geliştirme',
    parentId: null,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 5,
    modifiedAt: Date.now() - 86400000 * 5,
    iconName: 'work',
    sortMode: 'CUSTOM',
  },
  {
    id: 2,
    name: 'Frontend & UI',
    parentId: 1,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 4,
    modifiedAt: Date.now() - 86400000 * 4,
    iconName: 'star',
    sortMode: 'CUSTOM',
  },
  {
    id: 3,
    name: 'Müzik & Video',
    parentId: null,
    sortIndex: 1,
    createdAt: Date.now() - 86400000 * 3,
    modifiedAt: Date.now() - 86400000 * 3,
    iconName: 'music',
    sortMode: 'CUSTOM',
  },
  {
    id: 4,
    name: 'Yemek Tarifleri',
    parentId: null,
    sortIndex: 2,
    createdAt: Date.now() - 86400000 * 2,
    modifiedAt: Date.now() - 86400000 * 2,
    iconName: 'food',
    sortMode: 'NAME_ASC',
  },
];

const INITIAL_BOOKMARKS: BookmarkEntity[] = [
  {
    id: 101,
    title: 'GitHub',
    url: 'https://github.com',
    folderId: 1,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 5,
    modifiedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 102,
    title: 'Tailwind CSS Docs',
    url: 'https://tailwindcss.com/docs',
    folderId: 2,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 4,
    modifiedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 103,
    title: 'React Resmi Dokümantasyon',
    url: 'https://react.dev',
    folderId: 2,
    sortIndex: 1,
    createdAt: Date.now() - 86400000 * 3,
    modifiedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 104,
    title: 'YouTube Müzik',
    url: 'https://music.youtube.com',
    folderId: 3,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 2,
    modifiedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 105,
    title: 'Nefis Yemek Tarifleri',
    url: 'https://www.nefisyemektarifleri.com',
    folderId: 4,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 1,
    modifiedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 106,
    title: 'Google Arama',
    url: 'https://www.google.com',
    folderId: null,
    sortIndex: 0,
    createdAt: Date.now() - 86400000 * 6,
    modifiedAt: Date.now() - 86400000 * 6,
  },
];

export class DatabaseService {
  private static getStoredFolders(): FolderEntity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading folders from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(INITIAL_FOLDERS));
    return INITIAL_FOLDERS;
  }

  private static setStoredFolders(folders: FolderEntity[]) {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  }

  private static getStoredBookmarks(): BookmarkEntity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading bookmarks from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(INITIAL_BOOKMARKS));
    return INITIAL_BOOKMARKS;
  }

  private static setStoredBookmarks(bookmarks: BookmarkEntity[]) {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
  }

  // Folders API
  static getAllFolders(): FolderEntity[] {
    return this.getStoredFolders();
  }

  static getFolder(id: number): FolderEntity | undefined {
    return this.getAllFolders().find((f) => f.id === id);
  }

  static addFolder(name: string, parentId: number | null = null, iconName = 'folder'): FolderEntity {
    const folders = this.getStoredFolders();
    const newId = folders.length > 0 ? Math.max(...folders.map((f) => f.id)) + 1 : 1;
    const sameLevelFolders = folders.filter((f) => f.parentId === parentId);
    const newFolder: FolderEntity = {
      id: newId,
      name: name.trim() || 'Klasör',
      parentId,
      sortIndex: sameLevelFolders.length,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      iconName,
      sortMode: 'CUSTOM',
    };
    folders.push(newFolder);
    this.setStoredFolders(folders);
    return newFolder;
  }

  static updateFolder(folder: FolderEntity): void {
    const folders = this.getStoredFolders();
    const idx = folders.findIndex((f) => f.id === folder.id);
    if (idx >= 0) {
      folders[idx] = { ...folder, modifiedAt: Date.now() };
      this.setStoredFolders(folders);
    }
  }

  static setFolderSortMode(folderId: number, mode: SortingMode): void {
    const folders = this.getStoredFolders();
    const f = folders.find((i) => i.id === folderId);
    if (f) {
      f.sortMode = mode;
      f.modifiedAt = Date.now();
      this.setStoredFolders(folders);
    }
  }

  static deleteFolder(folderId: number): void {
    const folders = this.getStoredFolders();
    const bookmarks = this.getStoredBookmarks();

    // Collect all recursive child folder IDs
    const toDeleteFolderIds = new Set<number>();
    const gather = (id: number) => {
      toDeleteFolderIds.add(id);
      folders.filter((f) => f.parentId === id).forEach((f) => gather(f.id));
    };
    gather(folderId);

    const remainingFolders = folders.filter((f) => !toDeleteFolderIds.has(f.id));
    const remainingBookmarks = bookmarks.filter((b) => b.folderId === null || !toDeleteFolderIds.has(b.folderId));

    this.setStoredFolders(remainingFolders);
    this.setStoredBookmarks(remainingBookmarks);
  }

  static extractFolder(folderId: number): void {
    // Extract: move all bookmarks and child folders of folderId to its parentId
    const folders = this.getStoredFolders();
    const bookmarks = this.getStoredBookmarks();
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    const parentId = folder.parentId;

    const updatedFolders = folders.map((f) => {
      if (f.parentId === folderId) {
        return { ...f, parentId, modifiedAt: Date.now() };
      }
      return f;
    });

    const updatedBookmarks = bookmarks.map((b) => {
      if (b.folderId === folderId) {
        return { ...b, folderId: parentId, modifiedAt: Date.now() };
      }
      return b;
    });

    this.setStoredFolders(updatedFolders);
    this.setStoredBookmarks(updatedBookmarks);
  }

  // Bookmarks API
  static getAllBookmarks(): BookmarkEntity[] {
    return this.getStoredBookmarks();
  }

  static addBookmark(title: string, url: string, folderId: number | null = null): BookmarkEntity {
    const bookmarks = this.getStoredBookmarks();
    const newId = bookmarks.length > 0 ? Math.max(...bookmarks.map((b) => b.id)) + 1 : 1;
    const sameFolderBms = bookmarks.filter((b) => b.folderId === folderId);

    let cleanUrl = url.trim();
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const newBm: BookmarkEntity = {
      id: newId,
      title: title.trim() || cleanUrl,
      url: cleanUrl,
      folderId,
      sortIndex: sameFolderBms.length,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    bookmarks.push(newBm);
    this.setStoredBookmarks(bookmarks);
    return newBm;
  }

  static updateBookmark(bookmark: BookmarkEntity): void {
    const bookmarks = this.getStoredBookmarks();
    const idx = bookmarks.findIndex((b) => b.id === bookmark.id);
    if (idx >= 0) {
      bookmarks[idx] = { ...bookmark, modifiedAt: Date.now() };
      this.setStoredBookmarks(bookmarks);
    }
  }

  static deleteBookmark(bookmarkId: number): void {
    const bookmarks = this.getStoredBookmarks();
    this.setStoredBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
  }

  static deleteMultiple(bookmarkIds: number[], folderIds: number[]): void {
    folderIds.forEach((fId) => this.deleteFolder(fId));
    if (bookmarkIds.length > 0) {
      const bmSet = new Set(bookmarkIds);
      const bookmarks = this.getStoredBookmarks().filter((b) => !bmSet.has(b.id));
      this.setStoredBookmarks(bookmarks);
    }
  }

  static moveItems(bookmarkIds: number[], folderIds: number[], destinationFolderId: number | null): void {
    const folders = this.getStoredFolders();
    const bookmarks = this.getStoredBookmarks();

    // Prevent moving folder into itself or its own descendant
    const forbidden = new Set<number>();
    const markSubtree = (id: number) => {
      forbidden.add(id);
      folders.filter((f) => f.parentId === id).forEach((f) => markSubtree(f.id));
    };
    folderIds.forEach((fId) => markSubtree(fId));

    if (destinationFolderId !== null && forbidden.has(destinationFolderId)) {
      // Cannot move folder inside itself or its children
      return;
    }

    const updatedFolders = folders.map((f) => {
      if (folderIds.includes(f.id)) {
        return { ...f, parentId: destinationFolderId, modifiedAt: Date.now() };
      }
      return f;
    });

    const updatedBookmarks = bookmarks.map((b) => {
      if (bookmarkIds.includes(b.id)) {
        return { ...b, folderId: destinationFolderId, modifiedAt: Date.now() };
      }
      return b;
    });

    this.setStoredFolders(updatedFolders);
    this.setStoredBookmarks(updatedBookmarks);
  }

  static copyItems(bookmarkIds: number[], folderIds: number[], destinationFolderId: number | null): void {
    const folders = this.getStoredFolders();
    const bookmarks = this.getStoredBookmarks();

    let maxFolderId = folders.length > 0 ? Math.max(...folders.map((f) => f.id)) : 0;
    let maxBmId = bookmarks.length > 0 ? Math.max(...bookmarks.map((b) => b.id)) : 0;

    const newFolders: FolderEntity[] = [];
    const newBookmarks: BookmarkEntity[] = [];

    // Copy bookmarks
    const bmsToCopy = bookmarks.filter((b) => bookmarkIds.includes(b.id));
    for (const b of bmsToCopy) {
      maxBmId++;
      newBookmarks.push({
        ...b,
        id: maxBmId,
        folderId: destinationFolderId,
        sortIndex: b.sortIndex,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      });
    }

    // Copy folders with deep recursive subfolders and bookmarks
    const copySubtree = (srcFolderId: number, targetParentId: number | null) => {
      const srcFolder = folders.find((f) => f.id === srcFolderId);
      if (!srcFolder) return;
      maxFolderId++;
      const clonedFolderId = maxFolderId;
      newFolders.push({
        ...srcFolder,
        id: clonedFolderId,
        parentId: targetParentId,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      });

      // copy bookmarks inside srcFolder
      const subBms = bookmarks.filter((b) => b.folderId === srcFolderId);
      for (const sb of subBms) {
        maxBmId++;
        newBookmarks.push({
          ...sb,
          id: maxBmId,
          folderId: clonedFolderId,
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        });
      }

      // recurse for subfolders
      const subFolders = folders.filter((f) => f.parentId === srcFolderId);
      for (const sf of subFolders) {
        copySubtree(sf.id, clonedFolderId);
      }
    };

    for (const fId of folderIds) {
      copySubtree(fId, destinationFolderId);
    }

    this.setStoredFolders([...folders, ...newFolders]);
    this.setStoredBookmarks([...bookmarks, ...newBookmarks]);
  }

  // Reorder items (drag-and-drop support)
  // Supports drag & drop even when previously sorted by date or name!
  // Updates sortIndex and switches the folder (or root) to CUSTOM mode!
  static reorderItems(
    folderId: number | null,
    orderedItems: Array<{ id: number; type: 'folder' | 'bookmark' }>
  ): void {
    const folders = this.getStoredFolders();
    const bookmarks = this.getStoredBookmarks();

    // Map each item to its new sortIndex
    orderedItems.forEach((item, index) => {
      if (item.type === 'folder') {
        const f = folders.find((x) => x.id === item.id);
        if (f) {
          f.sortIndex = index;
          f.modifiedAt = Date.now();
        }
      } else {
        const b = bookmarks.find((x) => x.id === item.id);
        if (b) {
          b.sortIndex = index;
          b.modifiedAt = Date.now();
        }
      }
    });

    if (folderId !== null) {
      const targetFolder = folders.find((f) => f.id === folderId);
      if (targetFolder) {
        targetFolder.sortMode = 'CUSTOM';
      }
    }

    this.setStoredFolders(folders);
    this.setStoredBookmarks(bookmarks);
  }

  // Recursive helpers for folder statistics
  static getRecursiveStats(folderId: number): { folderCount: number; bookmarkCount: number } {
    const folders = this.getStoredFolders();
    const bookmarks = this.getStoredBookmarks();

    const folderIds = new Set<number>();
    const collect = (id: number) => {
      folders.filter((f) => f.parentId === id).forEach((f) => {
        folderIds.add(f.id);
        collect(f.id);
      });
    };
    collect(folderId);

    const targetFolders = new Set([folderId, ...folderIds]);
    const bCount = bookmarks.filter((b) => b.folderId !== null && targetFolders.has(b.folderId)).length;

    return {
      folderCount: folderIds.size,
      bookmarkCount: bCount,
    };
  }

  static replaceAll(folders: FolderEntity[], bookmarks: BookmarkEntity[]): void {
    this.setStoredFolders(folders);
    this.setStoredBookmarks(bookmarks);
  }

  static insertBatch(folders: FolderEntity[], bookmarks: BookmarkEntity[]): void {
    const existingFolders = this.getStoredFolders();
    const existingBookmarks = this.getStoredBookmarks();
    this.setStoredFolders([...existingFolders, ...folders]);
    this.setStoredBookmarks([...existingBookmarks, ...bookmarks]);
  }
}
