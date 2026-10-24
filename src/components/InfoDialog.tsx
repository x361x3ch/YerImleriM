import React from 'react';
import { X, Calendar, Clock, Globe, Folder, Hash } from 'lucide-react';

interface Props {
  title: string;
  url?: string;
  folderPath?: string;
  createdAt: number;
  modifiedAt: number;
  isFolder?: boolean;
  subfolderCount?: number;
  bookmarkCount?: number;
  onClose: () => void;
}

export const InfoDialog: React.FC<Props> = ({
  title,
  url,
  folderPath,
  createdAt,
  modifiedAt,
  isFolder = false,
  subfolderCount = 0,
  bookmarkCount = 0,
  onClose,
}) => {
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 text-base">
            {isFolder ? 'Klasör Bilgisi' : 'Yer İmi Bilgisi'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-sm">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
              {isFolder ? 'Klasör Adı' : 'Başlık'}
            </div>
            <div className="font-medium text-gray-900 break-words">{title}</div>
          </div>

          {url && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> URL
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline break-all text-xs font-mono"
              >
                {url}
              </a>
            </div>
          )}

          {folderPath && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5" /> Konum
              </div>
              <div className="text-gray-700 text-xs font-medium">{folderPath}</div>
            </div>
          )}

          {isFolder && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 font-medium">Alt Klasörler</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">{subfolderCount}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 font-medium">Toplam Yer İmi</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">{bookmarkCount}</div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                <Calendar className="w-3 h-3" /> İlk Eklendiği
              </div>
              <span className="font-medium text-gray-800">{formatDate(createdAt)}</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                <Clock className="w-3 h-3" /> Son Düzenlendiği
              </div>
              <span className="font-medium text-gray-800">{formatDate(modifiedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
