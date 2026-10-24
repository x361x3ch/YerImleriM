import React from 'react';
import { SortingMode, FolderEntity } from '../types';
import { X, ArrowDownUp, Check } from 'lucide-react';

interface Props {
  currentFolder: FolderEntity | null;
  currentSortMode: SortingMode;
  foldersOnTop: boolean;
  onSelectSortMode: (mode: SortingMode) => void;
  onToggleFoldersOnTop: (value: boolean) => void;
  onClose: () => void;
}

const SORT_OPTIONS: Array<{ mode: SortingMode; label: string; desc: string }> = [
  { mode: 'CUSTOM', label: 'Özel (Sürükle-bırak)', desc: 'İstediğiniz gibi sürükleyerek sıralayın' },
  { mode: 'DATE_DESC', label: 'Tarih · Yeni → Eski', desc: 'En son eklenenler en üstte' },
  { mode: 'DATE_ASC', label: 'Tarih · Eski → Yeni', desc: 'İlk eklenenler en üstte' },
  { mode: 'NAME_ASC', label: 'Alfabetik · A → Z', desc: 'A\'dan Z\'ye sıralama' },
  { mode: 'NAME_DESC', label: 'Alfabetik · Z → A', desc: 'Z\'den A\'ya sıralama' },
];

export const SortDialog: React.FC<Props> = ({
  currentFolder,
  currentSortMode,
  foldersOnTop,
  onSelectSortMode,
  onToggleFoldersOnTop,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Sıralama Ayarları</h3>
              <p className="text-[11px] text-gray-500">
                {currentFolder ? `Klasör: ${currentFolder.name}` : 'Genel Kök Dizin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSortMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  onSelectSortMode(opt.mode);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 text-blue-900 font-medium border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-gray-500 opacity-90">{opt.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Folders On Top Toggle */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/70">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={foldersOnTop}
              onChange={(e) => onToggleFoldersOnTop(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-gray-900 block">Klasörleri üstte tut</span>
              <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                {foldersOnTop
                  ? 'Klasörler her zaman listenin en başında gruplanır.'
                  : 'Klasörler yer imleri gibi sıralanır ve aralarda listelenir.'}
              </span>
            </div>
          </label>
        </div>

        {/* Drag Hint */}
        <div className="px-4 py-2.5 bg-blue-50/40 border-t border-blue-100/50 text-[11px] text-blue-800">
          💡 <strong>İpucu:</strong> Tarih veya ada göre sıralı olsa bile bir ögeyi sürükleyip bıraktığınızda sıralama otomatik olarak "Özel" moda geçer ve yerleşimi korunur.
        </div>
      </div>
    </div>
  );
};
