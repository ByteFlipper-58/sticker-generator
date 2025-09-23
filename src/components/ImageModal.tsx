import React from 'react';
import { XIcon } from './Icons';

export default function ImageModal({ show, onClose, imageUrl, t }: any) {
  if (!show || !imageUrl) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative p-4">
        <img src={imageUrl} alt={t('enlargedStickerAlt')} className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl" />
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute -top-2 -right-2 p-2 bg-white rounded-full text-black hover:bg-gray-200 transition">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}


