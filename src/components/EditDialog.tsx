import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface Props {
  initialTitle: string;
  initialUrl?: string | null;
  isFolder?: boolean;
  onSave: (newTitle: string, newUrl?: string) => void;
  onClose: () => void;
}

export const EditDialog: React.FC<Props> = ({
  initialTitle,
  initialUrl,
  isFolder = false,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(isFolder ? 'Klasör adı zorunludur' : 'Başlık zorunludur');
      return;
    }
    if (!isFolder && !url.trim()) {
      setError('Geçerli bir URL giriniz');
      return;
    }
    onSave(title.trim(), isFolder ? undefined : url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 text-base">
            {isFolder ? 'Klasörü Düzenle' : 'Yer İmini Düzenle'}
          </h3>
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
              {isFolder ? 'Klasör Adı' : 'Başlık'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
              placeholder={isFolder ? 'Örn: Faydalı Siteler' : 'Örn: Google'}
            />
          </div>

          {!isFolder && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-mono text-xs"
                placeholder="https://..."
              />
            </div>
          )}

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
