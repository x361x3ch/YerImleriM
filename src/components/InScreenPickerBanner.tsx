import React from 'react';
import { InScreenActionState, FolderEntity } from '../types';
import { Check, X, FolderInput, Copy, PlusCircle, Share2 } from 'lucide-react';

interface Props {
  actionState: InScreenActionState;
  currentFolder: FolderEntity | null;
  breadcrumbPath: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const InScreenPickerBanner: React.FC<Props> = ({
  actionState,
  currentFolder,
  breadcrumbPath,
  onConfirm,
  onCancel,
}) => {
  const getBannerDetails = () => {
    switch (actionState.type) {
      case 'move':
        const moveCount = (actionState.bookmarkIds?.length || 0) + (actionState.folderIds?.length || 0);
        return {
          icon: <FolderInput className="w-5 h-5 text-amber-500 flex-shrink-0 animate-bounce" />,
          title: `Taşıma Modu (${moveCount} öge)`,
          actionLabel: 'Buraya Taşı',
          bgClass: 'bg-amber-50 border-amber-200 text-amber-950',
          btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'copy':
        const copyCount = (actionState.bookmarkIds?.length || 0) + (actionState.folderIds?.length || 0);
        return {
          icon: <Copy className="w-5 h-5 text-blue-500 flex-shrink-0 animate-bounce" />,
          title: `Kopyalama Modu (${copyCount} öge)`,
          actionLabel: 'Buraya Kopyala',
          bgClass: 'bg-blue-50 border-blue-200 text-blue-950',
          btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      case 'add':
        return {
          icon: <PlusCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 animate-pulse" />,
          title: `Yer İmi Ekleme Modu`,
          desc: actionState.addData?.title || actionState.addData?.url,
          actionLabel: 'Buraya Ekle',
          bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        };
      case 'share':
        return {
          icon: <Share2 className="w-5 h-5 text-indigo-500 flex-shrink-0 animate-pulse" />,
          title: `Paylaşım Modu`,
          desc: actionState.addData?.title || actionState.addData?.url,
          actionLabel: 'Buraya Kaydet',
          bgClass: 'bg-indigo-50 border-indigo-200 text-indigo-950',
          btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
    }
  };

  const details = getBannerDetails();
  const targetName = currentFolder ? currentFolder.name : 'Kök Dizin';

  return (
    <div
      className={`sticky top-0 z-40 px-4 py-3 border-b shadow-sm transition-all ${details.bgClass}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          {details.icon}
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5 flex-wrap">
              <span>{details.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-current font-medium">
                Hedef: {targetName}
              </span>
            </div>
            <div className="text-xs opacity-80 mt-0.5 truncate max-w-md">
              {details.desc ? (
                <span className="font-medium truncate">{details.desc}</span>
              ) : (
                <span>Klasörler arasında serbestçe gezinip hedef klasörde butona tıklayın</span>
              )}
              <span className="ml-2 font-mono text-[11px] opacity-70">({breadcrumbPath})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white/80 hover:bg-white text-gray-700 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${details.btnClass}`}
          >
            <Check className="w-3.5 h-3.5" />
            {details.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
