import React, { useState } from 'react';
import { FolderEntity } from '../types';
import { X, Check, MapPin, Folder, Plus } from 'lucide-react';

interface Props {
  currentFolderId: number | null;
  allFolders: FolderEntity[];
  onSave: (title: string, url: string, folderId: number | null) => void;
  onStartInScreenPick: (title: string, url: string) => void;
  onClose: () => void;
}

export const AddBookmarkModal: React.FC<Props> = ({
  currentFolderId,
  allFolders,
  onSave,
  onStartInScreenPick,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [chosenFolderId, setChosenFolderId] = useState<number | null>(currentFolderId);
  const [error, setError] = useState('');

  const currentFolderName =
    chosenFolderId !== null
      ? allFolders.find((f) => f.id === chosenFolderId)?.name || 'Klasör'
      : 'Kök Dizin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Lütfen bir URL giriniz');
      return;
    }
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const cleanTitle = title.trim() || cleanUrl;
    onSave(cleanTitle, cleanUrl, chosenFolderId);
    onClose();
  };

  const handleInScreenNavigationMode = () => {
    if (!url.trim()) {
      setError('Lütfen önce bir URL giriniz');
      return;
    }
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const cleanTitle = title.trim() || cleanUrl;
    onStartInScreenPick(cleanTitle, cleanUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Yer İmi Ekle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              autoFocus
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Başlık (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Google veya GitHub"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Folder Target & In-screen selection button */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                Hedef Konum:
              </span>
              <span className="text-xs font-bold text-blue-700 px-2 py-0.5 rounded-md bg-blue-100/60">
                {currentFolderName}
              </span>
            </div>

            {/* In-Screen navigation button as requested */}
            <button
              type="button"
              onClick={handleInScreenNavigationMode}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Ana Ekranda Gezinerek Klasör Seç
            </button>

            {/* Quick dropdown alternative */}
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">veya listeden seçin:</label>
              <select
                value={chosenFolderId ?? ''}
                onChange={(e) =>
                  setChosenFolderId(e.target.value ? parseInt(e.target.value, 10) : null)
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-800"
              >
                <option value="">Kök Dizin (Üst klasör yok)</option>
                {allFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
