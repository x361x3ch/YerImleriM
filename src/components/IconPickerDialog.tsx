import React from 'react';
import { FLATICON_ITEMS, Flaticon } from '../icons/Flaticons';
import { IconPack } from '../types';
import { X, Check } from 'lucide-react';

interface Props {
  currentIcon: string;
  iconPack?: IconPack;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

export const IconPickerDialog: React.FC<Props> = ({
  currentIcon,
  iconPack = 'flaticon',
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Klasör İkonu Seç</h3>
            <p className="text-xs text-gray-500 mt-0.5">Flaticon simge paketinden bir ikon belirleyin</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icons Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3">
          {FLATICON_ITEMS.map((item) => {
            const isSelected = item.id === currentIcon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/80'
                }`}
              >
                <div className="relative mb-2">
                  <Flaticon name={item.id} pack={iconPack} size={32} />
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 leading-tight">
                  {item.nameTr.split('/')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
