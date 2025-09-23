import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DownloadIcon, LoaderCircle, XIcon } from './Icons';

export default function StickerSheetModal({ show, onClose, stickers, uploadedImage, isIOS, isAndroid, t }: any) {
  const sheetContentRef = useRef<HTMLDivElement | null>(null);
  const [isRenderingSheet, setIsRenderingSheet] = useState(false);
  const [staticSheetUrl, setStaticSheetUrl] = useState<string | null>(null);
  const isMobile = isIOS || isAndroid;

  const renderStaticSheet = useCallback(async () => {
    if (!isMobile || staticSheetUrl) return;
    setIsRenderingSheet(true);
    const happySticker = stickers.find((s: any) => s.emotion === 'Happy' && s.imageUrl);
    const laughingSticker = stickers.find((s: any) => s.emotion === 'Laughing' && s.imageUrl);
    const surprisedSticker = stickers.find((s: any) => s.emotion === 'Surprised' && s.imageUrl);
    const gridStickers = stickers.filter((s: any) => s.imageUrl).slice(0, 8);
    if (gridStickers.length === 0) { setIsRenderingSheet(false); return; }
    try {
      const sourcesToLoad = [uploadedImage, happySticker?.imageUrl, laughingSticker?.imageUrl, surprisedSticker?.imageUrl, ...gridStickers.map((s: any) => s.imageUrl)].filter(Boolean);
      const uniqueSources = [...new Set(sourcesToLoad)];
      const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = () => reject(new Error('Failed to load')); img.src = src; });
      const loadedImages = await Promise.all(uniqueSources.map(loadImage));
      const imageMap: Record<string, HTMLImageElement> = Object.fromEntries(uniqueSources.map((src, i) => [src, loadedImages[i]]));
      const calculateAspectRatioFit = (sw: number, sh: number, mw: number, mh: number) => { const r = Math.min(mw / sw, mh / sh); return { width: sw * r, height: sh * r, x: (mw - sw * r) / 2, y: (mh - sh * r) / 2 }; };
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D & { roundRect?: (...args: any[]) => void };
      const dpr = window.devicePixelRatio || 1;
      const padding = 40 * dpr, stickerSize = 200 * dpr, stickerGap = 20 * dpr, headerHeight = 150 * dpr, footerHeight = 100 * dpr, gridWidth = (stickerSize * 4) + (stickerGap * 3), gridHeight = (stickerSize * 2) + stickerGap, gridFooterGap = 40 * dpr;
      canvas.width = gridWidth + padding * 2; canvas.height = headerHeight + gridHeight + footerHeight + padding * 2 + gridFooterGap;
      ctx.fillStyle = '#E7E0CE'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000'; ctx.font = `bold ${48 * dpr}px "Google Sans", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t('gemStickersTitle'), canvas.width / 2, headerHeight / 2);
      const textMetrics = ctx.measureText(t('gemStickersTitle')); const borderWidth = 4 * dpr; const borderRadius = 10 * dpr;
      const drawRotatedStickerWithBorder = (img: HTMLImageElement, x: number, y: number, cw: number, ch: number, deg: number) => { ctx.save(); ctx.translate(x + cw / 2, y + ch / 2); ctx.rotate(deg * Math.PI / 180); ctx.fillStyle = 'white'; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 8 * dpr; ctx.shadowOffsetX = 2 * dpr; ctx.shadowOffsetY = 2 * dpr; ctx.beginPath(); if (ctx.roundRect) { ctx.roundRect(-cw / 2, -ch / 2, cw, ch, [borderRadius]); } else { ctx.rect(-cw / 2, -ch / 2, cw, ch); } ctx.fill(); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; const maxW = cw - borderWidth * 2; const maxH = ch - borderWidth * 2; const fit = calculateAspectRatioFit(img.naturalWidth, img.naturalHeight, maxW, maxH); ctx.drawImage(img, -fit.width / 2, -fit.height / 2, fit.width, fit.height); ctx.restore(); };
      if (uploadedImage && imageMap[uploadedImage]) { const cs = 120 * dpr; const tsx = canvas.width / 2 - textMetrics.width / 2; const ix = tsx - cs - (20 * dpr); const iy = (headerHeight / 2) - (cs / 2); drawRotatedStickerWithBorder(imageMap[uploadedImage], ix, iy, cs, cs, -15); }
      if (happySticker?.imageUrl && imageMap[happySticker.imageUrl]) { drawRotatedStickerWithBorder(imageMap[happySticker.imageUrl], canvas.width - padding - (3 * 80 * dpr), padding, 70 * dpr, 70 * dpr, -10); }
      if (laughingSticker?.imageUrl && imageMap[laughingSticker.imageUrl]) { drawRotatedStickerWithBorder(imageMap[laughingSticker.imageUrl], canvas.width - padding - (2 * 80 * dpr), padding, 70 * dpr, 70 * dpr, 15); }
      if (surprisedSticker?.imageUrl && imageMap[surprisedSticker.imageUrl]) { drawRotatedStickerWithBorder(imageMap[surprisedSticker.imageUrl], canvas.width - padding - (1 * 80 * dpr), padding, 70 * dpr, 70 * dpr, -5); }
      for (let i = 0; i < gridStickers.length; i++) { const row = Math.floor(i / 4); const col = i % 4; const x = padding + col * (stickerSize + stickerGap); const y = headerHeight + padding + row * (stickerSize + stickerGap); const stickerImg = imageMap[gridStickers[i].imageUrl]; ctx.fillStyle = 'white'; ctx.beginPath(); if (ctx.roundRect) { ctx.roundRect(x, y, stickerSize, stickerSize, [10 * dpr]); } else { ctx.rect(x, y, stickerSize, stickerSize); } ctx.fill(); if (stickerImg) { const imagePadding = 10 * dpr; const fit = calculateAspectRatioFit(stickerImg.naturalWidth, stickerImg.naturalHeight, stickerSize - imagePadding * 2, stickerSize - imagePadding * 2); ctx.drawImage(stickerImg, x + imagePadding + fit.x, y + imagePadding + fit.y, fit.width, fit.height); } }
      ctx.fillStyle = 'white'; ctx.beginPath(); if (ctx.roundRect) { ctx.roundRect(padding, canvas.height - padding - footerHeight, canvas.width - padding * 2, footerHeight, [10 * dpr]); } else { ctx.rect(padding, canvas.height - padding - footerHeight, canvas.width - padding * 2, footerHeight); } ctx.fill();
      ctx.fillStyle = '#333'; ctx.font = `bold ${24 * dpr}px "Google Sans", sans-serif`; ctx.fillText(t('madeWithGemini'), canvas.width / 2, canvas.height - padding - footerHeight / 2 - 10 * dpr); ctx.font = `${14 * dpr}px "Google Sans", sans-serif`; ctx.fillText(t('nanoBananaPromo'), canvas.width / 2, canvas.height - padding - footerHeight / 2 + 20 * dpr);
      setStaticSheetUrl(canvas.toDataURL('image/png'));
    } catch (error) { console.error('Failed to render static sticker sheet:', error); } finally { setIsRenderingSheet(false); }
  }, [isMobile, stickers, uploadedImage, staticSheetUrl, t]);

  useEffect(() => { if (show && isMobile && !staticSheetUrl) { renderStaticSheet(); } if (!show) { setStaticSheetUrl(null); } }, [show, isMobile, staticSheetUrl, renderStaticSheet]);

  const handleDownloadDesktop = () => {
    if (sheetContentRef.current && (window as any).html2canvas) {
      (window as any).html2canvas(sheetContentRef.current, { backgroundColor: '#E7E0CE', useCORS: true }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a'); link.download = 'gem-sticker-sheet.png'; link.href = canvas.toDataURL('image/png'); link.click();
      }).catch((err: any) => { console.error('html2canvas failed:', err); });
    }
  };

  const handleDownloadMobile = () => { if (staticSheetUrl) { const link = document.createElement('a'); link.href = staticSheetUrl; link.download = 'gem-sticker-sheet.png'; document.body.appendChild(link); link.click(); document.body.removeChild(link); } };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      {isMobile ? (
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl relative text-center" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition z-20"><XIcon className="w-6 h-6"/></button>
          {isRenderingSheet && (<div className="flex flex-col items-center justify-center min-h-[200px]"><LoaderCircle className="w-12 h-12 animate-spin mx-auto mb-4" /><p className="font-semibold">{t('preparingSheet')}</p></div>)}
          {staticSheetUrl && (
            <div>
              <img src={staticSheetUrl} alt="Sticker Sheet" className="w-full h-auto object-contain rounded-md" />
              {isAndroid && (<button onClick={handleDownloadMobile} className="mt-4 bg-[#5A544E] text-white font-medium py-2 px-6 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 flex items-center justify-center mx-auto whitespace-nowrap"><DownloadIcon className="w-6 h-6 mr-2" />{t('downloadSheet')}</button>)}
              {isIOS && (<p className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">{t('iosSaveInstruction')}</p>)}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-4xl relative" onClick={e => e.stopPropagation()}>
          <div ref={sheetContentRef} style={{ backgroundColor: '#E7E0CE' }} className="p-6 rounded-t-lg">
            <div className="flex justify-center items-center mb-6">
              <div className="flex items-center">{uploadedImage && <img src={uploadedImage} alt="Uploaded photo" className="h-36 object-contain transform -rotate-12 border-4 border-white rounded-lg shadow-md" />}</div>
              <div className="relative z-10 mx-4"><h1 className="text-4xl md:text-5xl font-bold font-googlesans text-black tracking-wide py-4">{t('gemStickersTitle')}</h1></div>
              <div className="flex items-center">
                {stickers.find((s: any) => s.emotion === 'Happy' && s.imageUrl) && <img src={stickers.find((s: any) => s.emotion === 'Happy' && s.imageUrl).imageUrl} alt="Happy sticker" className="h-20 object-contain transform -rotate-6 border-4 border-white rounded-lg shadow-md" />}
                {stickers.find((s: any) => s.emotion === 'Laughing' && s.imageUrl) && <img src={stickers.find((s: any) => s.emotion === 'Laughing' && s.imageUrl).imageUrl} alt="Laughing sticker" className="h-20 object-contain transform rotate-12 -ml-5 border-4 border-white rounded-lg shadow-md" />}
                {stickers.find((s: any) => s.emotion === 'Surprised' && s.imageUrl) && <img src={stickers.find((s: any) => s.emotion === 'Surprised' && s.imageUrl).imageUrl} alt="Surprised sticker" className="h-20 object-contain transform -rotate-3 -ml-5 border-4 border-white rounded-lg shadow-md" />}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto p-2 rounded-md">
              {stickers.filter((s: any) => s.imageUrl).map((sticker: any) => (
                <div key={sticker.emotion} className="flex flex-col items-center">
                  <img src={sticker.imageUrl} alt={sticker.emotion} className="w-full h-auto object-contain rounded-lg bg-white shadow-sm" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-4 text-center mt-6 font-googlesans">
              <p className="text-2xl font-bold text-gray-800">{t('madeWithGemini')}</p>
              <p className="text-xs text-gray-600">{t('nanoBananaPromo')}</p>
            </div>
          </div>
          <div className="bg-[#E7E0CE] rounded-b-lg p-4 text-center">
            <button onClick={handleDownloadDesktop} className="bg-[#5A544E] text-white font-medium py-2 px-6 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 flex items-center justify-center mx-auto whitespace-nowrap"><DownloadIcon className="w-6 h-6 mr-2" />{t('downloadSheet')}</button>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"><XIcon className="w-6 h-6"/></button>
        </div>
      )}
    </div>
  );
}


