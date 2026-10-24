import React, { useState } from 'react';
import { FolderEntity, IconPack } from '../types';
import { FLATICON_ITEMS, Flaticon } from '../icons/Flaticons';
import { X, Check, FolderPlus, Smile } from 'lucide-react';

interface Props {
  currentFolderId: number | null;
  allFolders: FolderEntity[];
  iconPack?: IconPack;
  onSave: (name: string, parentId: number | null, iconName: string) => void;
  onClose: () => void;
}

export const NewFolderModal: React.FC<Props> = ({
  currentFolderId,
  allFolders,
  iconPack = 'flaticon',
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(currentFolderId);
  const [iconName, setIconName] = useState('folder');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Klasör adı zorunludur');
      return;
    }
    onSave(name.trim(), parentId, iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Yeni Klasör</h3>
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
              Klasör Adı *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              autoFocus
              placeholder="Örn: Projeler veya Favoriler"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Üst Klasör
            </label>
            <select
              value={parentId ?? ''}
              onChange={(e) => setParentId(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-800"
            >
              <option value="">Kök Dizin (Ana seviye)</option>
              {allFolders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Flaticon Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-blue-500" />
              Klasör İkonu (Flaticon)
            </label>
            <div className="grid grid-cols-6 gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              {FLATICON_ITEMS.map((item) => {
                const isSelected = item.id === iconName;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIconName(item.id)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white shadow-sm ring-2 ring-blue-500 scale-105'
                        : 'hover:bg-white/70 opacity-80 hover:opacity-100'
                    }`}
                    title={item.nameTr}
                  >
                    <Flaticon name={item.id} pack={iconPack} size={22} />
                  </button>
                );
              })}
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
              className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
