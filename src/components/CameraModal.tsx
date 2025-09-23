import React from 'react';
import { CameraIcon, XIcon } from './Icons';

export default function CameraModal({ show, onClose, onCapture, videoRef, t }: any) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-4 w-full max-w-3xl relative">
        <h3 className="text-xl font-semibold mb-4 text-center">{t('cameraModalTitle')}</h3>
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-md h-auto"></video>
        <div className="flex justify-center mt-6 space-x-4">
          <button onClick={onCapture} className="p-4 bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
            <CameraIcon className="w-8 h-8"/>
          </button>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition">
          <XIcon className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
}


