import React, { useState, useRef } from 'react';
import { BookmarkEntity, FolderEntity } from '../types';
import { Importers } from '../services/importers';
import { Exporters } from '../services/exporters';
import { X, Upload, Download, Check, AlertCircle, FileText, Folder } from 'lucide-react';

interface Props {
  initialTab?: 'import' | 'export';
  allFolders: FolderEntity[];
  allBookmarks: BookmarkEntity[];
  selectedBookmarkIds: number[];
  selectedFolderIds: number[];
  onImportSuccess: (folders: FolderEntity[], bookmarks: BookmarkEntity[], mode: 'merge' | 'replace') => void;
  onClose: () => void;
}

export const ImportExportModal: React.FC<Props> = ({
  initialTab = 'import',
  allFolders,
  allBookmarks,
  selectedBookmarkIds,
  selectedFolderIds,
  onImportSuccess,
  onClose,
}) => {
  const [tab, setTab] = useState<'import' | 'export'>(initialTab);

  // Import state
  const [importMode, setImportMode] = useState<'merge' | 'replace' | 'into_folder'>('merge');
  const [targetFolderId, setTargetFolderId] = useState<number | null>(null);
  const [importFileContent, setImportFileContent] = useState<string>('');
  const [importFileName, setImportFileName] = useState<string>('');
  const [importFeedback, setImportFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export state
  const [exportFormat, setExportFormat] = useState<'netscape' | 'flat' | 'markdown' | 'json'>('netscape');
  const hasSelection = selectedBookmarkIds.length > 0 || selectedFolderIds.length > 0;
  const [exportScope, setExportScope] = useState<'all' | 'selected'>(hasSelection ? 'selected' : 'all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setImportFileContent(content);
      setImportFeedback(null);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!importFileContent) {
      setImportFeedback({ success: false, msg: 'Lütfen içe aktarılacak bir dosya seçin.' });
      return;
    }

    try {
      const destination = importMode === 'into_folder' ? targetFolderId : null;
      const parsed = Importers.parseAuto(
        importFileContent,
        destination,
        Date.now(),
        Date.now() + 100000
      );

      if (parsed.bookmarks.length === 0 && parsed.folders.length === 0) {
        setImportFeedback({
          success: false,
          msg: 'Dosyada geçerli yer imi veya klasör bulunamadı.',
        });
        return;
      }

      onImportSuccess(
        parsed.folders,
        parsed.bookmarks,
        importMode === 'replace' ? 'replace' : 'merge'
      );

      setImportFeedback({
        success: true,
        msg: `Başarıyla ${parsed.importedFolderCount} klasör ve ${parsed.importedBookmarkCount} yer imi içe aktarıldı!`,
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e: any) {
      setImportFeedback({
        success: false,
        msg: 'İçe aktarma sırasında bir hata oluştu: ' + (e.message || 'Geçersiz format'),
      });
    }
  };

  const handleExecuteExport = () => {
    let bmsToExport = allBookmarks;
    let foldersToExport = allFolders;

    if (exportScope === 'selected' && hasSelection) {
      const selectedFidSet = new Set(selectedFolderIds);
      const recursiveFolderIds = new Set<number>();
      const gather = (id: number) => {
        recursiveFolderIds.add(id);
        allFolders.filter((f) => f.parentId === id).forEach((f) => gather(f.id));
      };
      selectedFolderIds.forEach(gather);

      foldersToExport = allFolders.filter((f) => recursiveFolderIds.has(f.id));
      bmsToExport = allBookmarks.filter(
        (b) =>
          selectedBookmarkIds.includes(b.id) ||
          (b.folderId !== null && recursiveFolderIds.has(b.folderId))
      );
    }

    let content = '';
    let filename = '';
    let mime = 'text/plain';

    switch (exportFormat) {
      case 'netscape':
        content = Exporters.exportNetscapeHtml(bmsToExport, foldersToExport);
        filename = 'yerimlerim_bookmarks.html';
        mime = 'text/html';
        break;
      case 'flat':
        content = Exporters.exportFlatHtml(bmsToExport, foldersToExport);
        filename = 'yerimlerim_flat.html';
        mime = 'text/html';
        break;
      case 'markdown':
        content = Exporters.exportMarkdown(bmsToExport, foldersToExport);
        filename = 'yerimlerim_bookmarks.md';
        mime = 'text/markdown';
        break;
      case 'json':
        content = Exporters.exportJson(bmsToExport, foldersToExport);
        filename = 'yerimlerim_backup.json';
        mime = 'application/json';
        break;
    }

    Exporters.downloadFile(content, filename, mime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header with Tabs */}
        <div className="px-5 pt-4 pb-0 border-b border-gray-100 bg-gray-50/50 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-base">İçe / Dışa Aktarma</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTab('import')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                tab === 'import'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              İçe Aktar (Import)
            </button>
            <button
              type="button"
              onClick={() => setTab('export')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                tab === 'export'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Dışa Aktar (Export)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {tab === 'import' ? (
            <div className="space-y-4">
              {/* File upload dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".html,.htm,.json,.txt,.md,.csv"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-80" />
                  {importFileName ? (
                    <div>
                      <div className="font-semibold text-gray-800 text-xs">{importFileName}</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-1">
                        Dosya seçildi (Değiştirmek için tıklayın)
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-gray-800 text-xs">
                        Bir dosya seçin veya buraya tıklayın
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        HTML (Chrome / Firefox / YerİmleriM), JSON, Markdown veya metin
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  İçe Aktarma Modu
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'merge',
                      title: 'Birleştir (Mevcut verileri koru)',
                      desc: 'Mevcut yer imlerinin yanına ekler.',
                    },
                    {
                      id: 'replace',
                      title: 'Değiştir (Tümünü sil ve yükle)',
                      desc: 'Mevcut tüm yer imlerini siler, dosyayı yükler.',
                    },
                    {
                      id: 'into_folder',
                      title: 'Belirli bir klasörün içine aktar',
                      desc: 'Tüm içeriği seçilen klasör altına yerleştirir.',
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        importMode === m.id
                          ? 'border-blue-500 bg-blue-50/50 text-blue-950 ring-1 ring-blue-500/20'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="importMode"
                        value={m.id}
                        checked={importMode === m.id}
                        onChange={() => setImportMode(m.id as any)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-semibold">{m.title}</div>
                        <div className="text-[11px] text-gray-500">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Destination folder picker if into_folder */}
              {importMode === 'into_folder' && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-amber-500" />
                    Hedef Klasör
                  </label>
                  <select
                    value={targetFolderId ?? ''}
                    onChange={(e) =>
                      setTargetFolderId(e.target.value ? parseInt(e.target.value, 10) : null)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800"
                  >
                    <option value="">Kök Dizin (Üst klasör yok)</option>
                    {allFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Feedback Alert */}
              {importFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    importFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {importFeedback.success ? (
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span>{importFeedback.msg}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Scope Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Dışa Aktarılacak Kapsam
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportScope('all')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      exportScope === 'all'
                        ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-900">Tüm Yer İmleri</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {allBookmarks.length} yer imi, {allFolders.length} klasör
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => setExportScope('selected')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      !hasSelection
                        ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                        : exportScope === 'selected'
                        ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-900">Seçili Ögeler</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {hasSelection
                        ? `${selectedBookmarkIds.length} yer imi, ${selectedFolderIds.length} klasör`
                        : 'Şu an seçim yapılmadı'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Dışa Aktarma Formatı
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'netscape',
                      title: 'Netscape HTML (Önerilen)',
                      desc: 'İç içe klasörleri tam korur. Chrome, Firefox ve Safari ile tam uyumlu.',
                    },
                    {
                      id: 'flat',
                      title: 'Düz HTML',
                      desc: 'Tek seviyeli liste görünümünde sade HTML.',
                    },
                    {
                      id: 'markdown',
                      title: 'Markdown (.md)',
                      desc: 'GitHub, Obsidian veya Notion için başlık ve bağlantı formatı.',
                    },
                    {
                      id: 'json',
                      title: 'JSON (Tam Yedekleme)',
                      desc: 'Tüm ayarlar, ID hiyerarşisi ve simgeleri içeren ham veri yedeği.',
                    },
                  ].map((f) => (
                    <label
                      key={f.id}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        exportFormat === f.id
                          ? 'border-blue-500 bg-blue-50/50 text-blue-950 ring-1 ring-blue-500/20'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportFormat"
                        value={f.id}
                        checked={exportFormat === f.id}
                        onChange={() => setExportFormat(f.id as any)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-semibold">{f.title}</div>
                        <div className="text-[11px] text-gray-500">{f.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200/60 rounded-lg transition-colors"
          >
            Kapat
          </button>
          {tab === 'import' ? (
            <button
              type="button"
              disabled={!importFileContent}
              onClick={handleExecuteImport}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
                importFileContent
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              İçe Aktar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleExecuteExport}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Dosyayı İndir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
