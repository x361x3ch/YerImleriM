import React, { useState } from 'react';
import { X, Share2, ArrowRight } from 'lucide-react';

interface Props {
  onStartShare: (title: string, url: string) => void;
  onClose: () => void;
}

export const SimulateShareModal: React.FC<Props> = ({ onStartShare, onClose }) => {
  const [title, setTitle] = useState('Google AI Studio');
  const [url, setUrl] = useState('https://aistudio.google.com');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onStartShare(title.trim(), url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Paylaşım Menüsü</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleStart} className="p-5 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Dışarıdan (örneğin bir tarayıcıdan) "Paylaş → Yer İmleri M" ile gönderilen bağlantıyı simüle edin. Gönderildiğinde ana ekranda gezinti yaparak istediğiniz klasöre kaydedebilirsiniz.
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

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
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Ana Ekranda Gezinerek Kaydet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
