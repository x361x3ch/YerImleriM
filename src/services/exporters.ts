import { BookmarkEntity, FolderEntity } from '../types';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJson(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

export class Exporters {
  static exportNetscapeHtml(
    bookmarks: BookmarkEntity[],
    folders: FolderEntity[],
    title = 'Yer İmleri M'
  ): string {
    let out = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${escapeHtml(title)}</TITLE>
<H1>${escapeHtml(title)}</H1>
<DL><p>
`;

    const folderChildren = new Map<number | null, FolderEntity[]>();
    for (const f of folders) {
      const p = f.parentId;
      if (!folderChildren.has(p)) folderChildren.set(p, []);
      folderChildren.get(p)!.push(f);
    }

    const bookmarkByFolder = new Map<number | null, BookmarkEntity[]>();
    for (const b of bookmarks) {
      const f = b.folderId;
      if (!bookmarkByFolder.has(f)) bookmarkByFolder.set(f, []);
      bookmarkByFolder.get(f)!.push(b);
    }

    const writeLevel = (parentId: number | null, indent: string) => {
      // Write bookmarks in this level
      const bms = (bookmarkByFolder.get(parentId) || []).sort((a, b) => a.sortIndex - b.sortIndex);
      for (const bm of bms) {
        out += `${indent}<DT><A HREF="${escapeHtml(bm.url)}" ADD_DATE="${Math.floor(
          bm.createdAt / 1000
        )}">${escapeHtml(bm.title)}</A>\n`;
      }

      // Write subfolders in this level
      const subFolders = (folderChildren.get(parentId) || []).sort((a, b) => a.sortIndex - b.sortIndex);
      for (const f of subFolders) {
        out += `${indent}<DT><H3 ADD_DATE="${Math.floor(f.createdAt / 1000)}" LAST_MODIFIED="${Math.floor(
          f.modifiedAt / 1000
        )}">${escapeHtml(f.name)}</H3>\n`;
        out += `${indent}<DL><p>\n`;
        writeLevel(f.id, indent + '    ');
        out += `${indent}</DL><p>\n`;
      }
    };

    writeLevel(null, '    ');
    out += '</DL><p>\n';
    return out;
  }

  static exportFlatHtml(bookmarks: BookmarkEntity[], folders: FolderEntity[], title = 'Yer İmleri M'): string {
    const folderMap = new Map(folders.map((f) => [f.id, f.name]));
    let out = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(
      title
    )}</title></head><body>\n<h1>${escapeHtml(title)}</h1>\n<ul>\n`;

    const sorted = [...bookmarks].sort((a, b) => a.createdAt - b.createdAt);
    for (const b of sorted) {
      const fName = b.folderId !== null ? folderMap.get(b.folderId) || '—' : '—';
      out += `  <li>[${escapeHtml(fName)}] <a href="${escapeHtml(b.url)}">${escapeHtml(b.title)}</a></li>\n`;
    }
    out += '</ul>\n</body></html>\n';
    return out;
  }

  static exportMarkdown(bookmarks: BookmarkEntity[], folders: FolderEntity[], title = 'Yer İmleri M'): string {
    let out = `# ${title}\n\n`;
    const bookmarkByFolder = new Map<number | null, BookmarkEntity[]>();
    for (const b of bookmarks) {
      const f = b.folderId;
      if (!bookmarkByFolder.has(f)) bookmarkByFolder.set(f, []);
      bookmarkByFolder.get(f)!.push(b);
    }

    const walk = (parentId: number | null, depth: number) => {
      const subFolders = folders.filter((f) => f.parentId === parentId).sort((a, b) => a.sortIndex - b.sortIndex);
      for (const f of subFolders) {
        out += `${'#'.repeat(depth + 2)} ${f.name}\n\n`;
        walk(f.id, depth + 1);
      }

      const bms = (bookmarkByFolder.get(parentId) || []).sort((a, b) => a.sortIndex - b.sortIndex);
      for (const b of bms) {
        out += `- [${b.title}](${b.url})\n`;
      }
      if (parentId !== null && (subFolders.length > 0 || bms.length > 0)) {
        out += '\n';
      }
    };

    walk(null, 0);
    return out;
  }

  static exportJson(bookmarks: BookmarkEntity[], folders: FolderEntity[], title = 'Yer İmleri M'): string {
    const data = {
      title,
      exportedAt: Date.now(),
      folders: folders.map((f) => ({
        id: f.id,
        name: f.name,
        parentId: f.parentId,
        iconName: f.iconName,
        sortMode: f.sortMode,
        sortIndex: f.sortIndex,
        createdAt: f.createdAt,
        modifiedAt: f.modifiedAt,
      })),
      bookmarks: bookmarks.map((b) => ({
        id: b.id,
        title: b.title,
        url: b.url,
        folderId: b.folderId,
        sortIndex: b.sortIndex,
        createdAt: b.createdAt,
        modifiedAt: b.modifiedAt,
      })),
    };
    return JSON.stringify(data, null, 2);
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
