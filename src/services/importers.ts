import { BookmarkEntity, FolderEntity } from '../types';

export interface ImportResult {
  folders: FolderEntity[];
  bookmarks: BookmarkEntity[];
  importedBookmarkCount: number;
  importedFolderCount: number;
}

function decodeHtmlEntities(str: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export class Importers {
  /**
   * Netscape Bookmark HTML parser.
   * Robust state-machine that reliably tracks folder stacks and nested hierarchies,
   * completely resolving the bug where nested folders imported as empty.
   */
  static parseNetscapeHtml(
    html: string,
    targetFolderId: number | null = null,
    baseFolderId = 1000,
    baseBookmarkId = 2000
  ): ImportResult {
    const folders: FolderEntity[] = [];
    const bookmarks: BookmarkEntity[] = [];

    let nextFolderId = baseFolderId;
    let nextBmId = baseBookmarkId;

    // Stack of active folder IDs: top of stack is the current folder
    const folderStack: number[] = [];

    // Track a pending folder header that was encountered right before an opening <DL>
    let pendingFolder: { name: string; createdAt: number } | null = null;

    // Tokenizer matching <H3>, <DL>, </DL>, <A>
    // Handles case-insensitivity, arbitrary attributes, linebreaks
    const tokenRegex =
      /<H3[^>]*>([\s\S]*?)<\/H3>|<DL[\s\S]*?>|<\/DL>|<A\s+[^>]*?HREF=["']([^"']*)["'][^>]*>([\s\S]*?)<\/A>/gi;

    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(html)) !== null) {
      const fullMatch = match[0];
      const h3Content = match[1];
      const aHref = match[2];
      const aTitle = match[3];

      if (h3Content !== undefined) {
        // If there was an earlier pending folder that had no <DL>, commit it as empty folder
        if (pendingFolder) {
          const parent = folderStack.length > 0 ? folderStack[folderStack.length - 1] : targetFolderId;
          const fid = nextFolderId++;
          folders.push({
            id: fid,
            name: pendingFolder.name,
            parentId: parent,
            sortIndex: folders.filter((f) => f.parentId === parent).length,
            createdAt: pendingFolder.createdAt,
            modifiedAt: Date.now(),
            iconName: 'folder',
            sortMode: 'CUSTOM',
          });
          pendingFolder = null;
        }

        const cleanName = decodeHtmlEntities(h3Content.replace(/<[^>]*>/g, '').trim()) || 'Klasör';
        // Extract ADD_DATE if present
        const dateMatch = fullMatch.match(/ADD_DATE=["']?(\d+)["']?/i);
        const createdAt = dateMatch ? parseInt(dateMatch[1], 10) * 1000 : Date.now();

        pendingFolder = {
          name: cleanName,
          createdAt,
        };
      } else if (fullMatch.toUpperCase().startsWith('<DL')) {
        if (pendingFolder) {
          // This <DL> belongs to the pending folder! Push it onto the folder stack
          const parent = folderStack.length > 0 ? folderStack[folderStack.length - 1] : targetFolderId;
          const fid = nextFolderId++;
          folders.push({
            id: fid,
            name: pendingFolder.name,
            parentId: parent,
            sortIndex: folders.filter((f) => f.parentId === parent).length,
            createdAt: pendingFolder.createdAt,
            modifiedAt: Date.now(),
            iconName: 'folder',
            sortMode: 'CUSTOM',
          });
          folderStack.push(fid);
          pendingFolder = null;
        } else {
          // This is a root <DL> or container <DL>, do nothing to the stack
        }
      } else if (fullMatch.toUpperCase().startsWith('</DL')) {
        // Leaving current folder level
        if (pendingFolder) {
          const parent = folderStack.length > 0 ? folderStack[folderStack.length - 1] : targetFolderId;
          const fid = nextFolderId++;
          folders.push({
            id: fid,
            name: pendingFolder.name,
            parentId: parent,
            sortIndex: folders.filter((f) => f.parentId === parent).length,
            createdAt: pendingFolder.createdAt,
            modifiedAt: Date.now(),
            iconName: 'folder',
            sortMode: 'CUSTOM',
          });
          pendingFolder = null;
        }
        if (folderStack.length > 0) {
          folderStack.pop();
        }
      } else if (aHref !== undefined) {
        // Link encountered!
        const url = decodeHtmlEntities(aHref.trim());
        if (url && !url.toLowerCase().startsWith('javascript:')) {
          const rawTitle = aTitle ? aTitle.replace(/<[^>]*>/g, '').trim() : '';
          const title = decodeHtmlEntities(rawTitle) || url;

          const parent = folderStack.length > 0 ? folderStack[folderStack.length - 1] : targetFolderId;

          const dateMatch = fullMatch.match(/ADD_DATE=["']?(\d+)["']?/i);
          const createdAt = dateMatch ? parseInt(dateMatch[1], 10) * 1000 : Date.now();

          bookmarks.push({
            id: nextBmId++,
            title,
            url,
            folderId: parent,
            sortIndex: bookmarks.filter((b) => b.folderId === parent).length,
            createdAt,
            modifiedAt: createdAt,
          });
        }
      }
    }

    // Flush any pending folder at EOF
    if (pendingFolder) {
      const parent = folderStack.length > 0 ? folderStack[folderStack.length - 1] : targetFolderId;
      const fid = nextFolderId++;
      folders.push({
        id: fid,
        name: pendingFolder.name,
        parentId: parent,
        sortIndex: folders.filter((f) => f.parentId === parent).length,
        createdAt: pendingFolder.createdAt,
        modifiedAt: Date.now(),
        iconName: 'folder',
        sortMode: 'CUSTOM',
      });
    }

    return {
      folders,
      bookmarks,
      importedFolderCount: folders.length,
      importedBookmarkCount: bookmarks.length,
    };
  }

  /**
   * JSON backup importer with parentId remapping
   */
  static parseJson(
    jsonStr: string,
    targetFolderId: number | null = null,
    baseFolderId = 1000,
    baseBookmarkId = 2000
  ): ImportResult | null {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || (!Array.isArray(data.folders) && !Array.isArray(data.bookmarks))) {
        return null;
      }

      const rawFolders = (data.folders || []) as Array<{
        id: number;
        name: string;
        parentId?: number | null;
        iconName?: string;
        sortMode?: string;
        sortIndex?: number;
        createdAt?: number;
        modifiedAt?: number;
      }>;

      const rawBookmarks = (data.bookmarks || []) as Array<{
        id: number;
        title: string;
        url: string;
        folderId?: number | null;
        sortIndex?: number;
        createdAt?: number;
        modifiedAt?: number;
      }>;

      let nextFolderId = baseFolderId;
      let nextBmId = baseBookmarkId;

      // Remap old folder IDs to new IDs
      const idMap = new Map<number, number>();

      // Topological sort folders so parents are inserted before children
      const sortedRawFolders: typeof rawFolders = [];
      const visited = new Set<number>();
      const folderById = new Map(rawFolders.map((f) => [f.id, f]));

      const visit = (f: (typeof rawFolders)[0]) => {
        if (visited.has(f.id)) return;
        if (f.parentId && folderById.has(f.parentId)) {
          visit(folderById.get(f.parentId)!);
        }
        visited.add(f.id);
        sortedRawFolders.push(f);
      };

      rawFolders.forEach(visit);

      const folders: FolderEntity[] = [];
      for (const f of sortedRawFolders) {
        const newId = nextFolderId++;
        idMap.set(f.id, newId);
        const resolvedParent = f.parentId !== null && f.parentId !== undefined && idMap.has(f.parentId)
          ? idMap.get(f.parentId)!
          : targetFolderId;

        folders.push({
          id: newId,
          name: f.name || 'Klasör',
          parentId: resolvedParent,
          sortIndex: f.sortIndex ?? folders.length,
          createdAt: f.createdAt ?? Date.now(),
          modifiedAt: f.modifiedAt ?? Date.now(),
          iconName: f.iconName || 'folder',
          sortMode: (f.sortMode as any) || 'CUSTOM',
        });
      }

      const bookmarks: BookmarkEntity[] = [];
      for (const b of rawBookmarks) {
        if (!b.url) continue;
        const newBmId = nextBmId++;
        const resolvedFolder =
          b.folderId !== null && b.folderId !== undefined && idMap.has(b.folderId)
            ? idMap.get(b.folderId)!
            : targetFolderId;

        bookmarks.push({
          id: newBmId,
          title: b.title || b.url,
          url: b.url,
          folderId: resolvedFolder,
          sortIndex: b.sortIndex ?? bookmarks.length,
          createdAt: b.createdAt ?? Date.now(),
          modifiedAt: b.modifiedAt ?? Date.now(),
        });
      }

      return {
        folders,
        bookmarks,
        importedFolderCount: folders.length,
        importedBookmarkCount: bookmarks.length,
      };
    } catch (e) {
      console.error('Failed to parse JSON backup', e);
      return null;
    }
  }

  /**
   * Plain text / Markdown / CSV importer:
   * Supports:
   *   [Title](URL)
   *   Title | URL
   *   Title - URL
   *   URL
   */
  static parsePlainText(
    text: string,
    targetFolderId: number | null = null,
    baseBookmarkId = 2000
  ): ImportResult {
    const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/;
    const urlRegex = /https?:\/\/[^\s,;)]+/i;

    const lines = text.split('\n');
    const bookmarks: BookmarkEntity[] = [];
    let nextBmId = baseBookmarkId;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      // 1. Markdown link [Title](URL)
      const mdMatch = line.match(mdRegex);
      if (mdMatch) {
        const title = mdMatch[1].trim();
        const url = mdMatch[2].trim();
        if (url) {
          bookmarks.push({
            id: nextBmId++,
            title: title || url,
            url,
            folderId: targetFolderId,
            sortIndex: bookmarks.length,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
          });
          continue;
        }
      }

      // 2. Direct URL found on line
      const urlMatch = line.match(urlRegex);
      if (urlMatch) {
        const url = urlMatch[0];
        let title = line.replace(url, '').replace(/^[-|:–—\s]+|[-|:–—\s]+$/g, '').trim();
        bookmarks.push({
          id: nextBmId++,
          title: title || url,
          url,
          folderId: targetFolderId,
          sortIndex: bookmarks.length,
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        });
        continue;
      }

      // 3. Pipe-separated Title | URL
      if (line.includes('|')) {
        const parts = line.split('|');
        if (parts.length >= 2) {
          const title = parts[0].trim();
          let url = parts[1].trim();
          if (url) {
            if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
            bookmarks.push({
              id: nextBmId++,
              title: title || url,
              url,
              folderId: targetFolderId,
              sortIndex: bookmarks.length,
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            });
          }
        }
      }
    }

    return {
      folders: [],
      bookmarks,
      importedFolderCount: 0,
      importedBookmarkCount: bookmarks.length,
    };
  }

  /**
   * Unified auto-detect import:
   * Detects HTML (Netscape/Flat), JSON, or Plaintext and returns parsed folders & bookmarks
   */
  static parseAuto(
    rawText: string,
    targetFolderId: number | null = null,
    baseFolderId = 1000,
    baseBookmarkId = 2000
  ): ImportResult {
    const trimmed = rawText.trim();

    // Try JSON
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const jsonRes = this.parseJson(trimmed, targetFolderId, baseFolderId, baseBookmarkId);
      if (jsonRes && (jsonRes.folders.length > 0 || jsonRes.bookmarks.length > 0)) {
        return jsonRes;
      }
    }

    // Try Netscape HTML
    if (/<DL|<H3|<A\s+/i.test(trimmed)) {
      const htmlRes = this.parseNetscapeHtml(trimmed, targetFolderId, baseFolderId, baseBookmarkId);
      if (htmlRes.folders.length > 0 || htmlRes.bookmarks.length > 0) {
        return htmlRes;
      }
    }

    // Fallback to text/markdown/CSV
    return this.parsePlainText(trimmed, targetFolderId, baseBookmarkId);
  }
}
