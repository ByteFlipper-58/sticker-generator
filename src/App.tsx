import React, { useState, useCallback, useEffect, useRef } from 'react';
import CameraModal from './components/CameraModal';
import ImageModal from './components/ImageModal';
import StickerSheetModal from './components/StickerSheetModal';
import { UploadCloud, LoaderCircle, AlertTriangle, CameraIcon, RefreshIcon, DownloadIcon, ChevronLeft, ChevronRight, XIcon } from './components/Icons';


// --- Main Application Component ---

const translations = {
  en: {
    appSubtitle: "Turn any selfie into a custom sticker set",
    takePhoto: "Take Photo",
    retakePhoto: "Retake Photo",
    useWebcam: "Use Webcam",
    retakeWebcam: "Retake with Webcam",
    uploadPhoto: "Upload Photo",
    changePhoto: "Change Photo",
    chooseStyle: "Choose a style",
    createStickers: "Create Stickers",
    generating: "Generating...",
    generatingStickers: "Generating stickers...",
    stickersAppearHere: "Your generated stickers will appear here.",
    followSteps: "Follow the steps to get started!",
    generatingMagic: "Generating your stickers...",
    magicMoment: "This can take a moment. Gemini is working its magic!",
    errorOccurred: "An Error Occurred",
    generatingPlaceholder: "Generating",
    failedPlaceholder: "Failed",
    retry: "Retry",
    viewStickerSheet: "View Sticker Sheet",
    downloadAll: "Download all",
    zipping: "Zipping...",
    tip: "Tip:",
    iosTip: "On an iOS device, you can tap and hold any sticker to save the image to your photos.",
    errorUploadProfilePic: "Please upload a profile picture first.",
    errorInvalidImage: "Please upload a valid image file.",
    errorCameraAccess: "Could not access the camera. Please ensure it's enabled and not in use by another application.",
    errorDownloadSticker: "Sorry, there was an error downloading this sticker.",
    errorDownloadAll: "Could not download all stickers. The required library is not available.",
    errorZip: "Sorry, there was an error creating the zip file.",
    cameraModalTitle: "Take a Photo",
    enlargedStickerAlt: "Enlarged sticker",
    preparingSheet: "Preparing your sticker sheet...",
    downloadSheet: "Download Sheet",
    iosSaveInstruction: "Tap and hold the image to save your sticker sheet.",
    madeWithGemini: "Made with Gemini",
    nanoBananaPromo: "Edit your images with Nano Banana at gemini.google",
    gemStickersTitle: "GEM STICKERS",
  },
  ja: {
    appSubtitle: "自撮りをステッカーに",
    takePhoto: "写真を撮る",
    retakePhoto: "もう一度撮る",
    useWebcam: "ウェブカメラで撮る",
    retakeWebcam: "ウェブカメラでもう一度撮る",
    uploadPhoto: "写真をアップロード",
    changePhoto: "写真を変更",
    chooseStyle: "スタイルを選択",
    createStickers: "ステッカーを作成",
    generating: "生成中...",
    generatingStickers: "ステッカーを生成中...",
    stickersAppearHere: "生成されたステッカーはここに表示されます",
    followSteps: "さあ、始めましょう！",
    generatingMagic: "ステッカーを生成中です...",
    magicMoment: "少々お待ちください。Gemini が回答を準備中です！",
    errorOccurred: "エラーが発生しました",
    generatingPlaceholder: "生成中",
    failedPlaceholder: "失敗",
    retry: "再試行",
    viewStickerSheet: "ステッカーシートを見る",
    downloadAll: "すべてダウンロード",
    zipping: "圧縮中...",
    tip: "ヒント:",
    iosTip: "iOSデバイスでは、ステッカーを長押して端末に保存できます。",
    errorUploadProfilePic: "最初にプロフィール写真をアップロードしてください。",
    errorInvalidImage: "有効な画像ファイルをアップロードしてください。",
    errorCameraAccess: "カメラにアクセスできませんでした。有効になっているか、他のアプリケーションで使用されていないか確認してください。",
    errorDownloadSticker: "申し訳ありませんが、ステッカーのダウンロード中にエラーが発生しました。",
    errorDownloadAll: "すべてのステッカーをダウンロードできませんでした。必要なライブラリが利用できません。",
    errorZip: "申し訳ありませんが、zipファイルの作成中にエラーが発生しました。",
    cameraModalTitle: "写真を撮る",
    enlargedStickerAlt: "拡大ステッカー",
    preparingSheet: "ステッカーシートを準備中...",
    downloadSheet: "シートをダウンロード",
    iosSaveInstruction: "画像を長押ししてステッカーシートを保存",
    madeWithGemini: "Gemini で作成",
    nanoBananaPromo: "gemini.google で Nano Banana を使って画像を編集",
    gemStickersTitle: "ジェムステッカー",
  }
} as const;

const styleOptions = [
  { id: 'pop-art', en: 'Pop Art', ja: 'ポップアート', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/pop_art_love.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/pop_art_love_out.png' },
  { id: 'japanese-matchbox', en: 'Retro Japanese Matchbox', ja: 'レトロマッチ箱', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/matchbox.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/matchbox_out.png' },
  { id: 'cartoon-dino', en: 'Cartoon Dino', ja: '恐竜漫画', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/dragon.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/dragon_out.png' },
  { id: 'pixel-art', en: 'Pixel Art', ja: 'ピクセルアート', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/pixel.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/pixel_out.png' },
  { id: 'royal', en: 'Royal', ja: '王室', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/royal.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/royal_out.png' },
  { id: 'football-sticker', en: 'Football Sticker', ja: 'サッカーシール', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/football.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/football_out.png' },
  { id: 'claymation', en: 'Claymation', ja: 'クレイアニメ', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/claymation.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/claymation_out.png' },
  { id: 'vintage-bollywood', en: 'Vintage Bollywood', ja: 'ボリウッド', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/bolly.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/bolly_out.png' },
  { id: 'sticker-bomb', en: 'Sticker Bomb', ja: 'ステッカーボム', imgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/bomb.png', selectedImgUrl: 'https://gstatic.com/synthidtextdemo/images/gemstickers/dot/bomb_out.png' },
];

const emotions = [
  { key: 'Happy', en: 'Happy', ja: 'ハッピー' },
  { key: 'Sad', en: 'Sad', ja: '悲しい' },
  { key: 'Angry', en: 'Angry', ja: '怒り' },
  { key: 'Surprised', en: 'Surprised', ja: '驚き' },
  { key: 'Laughing', en: 'Laughing', ja: '笑い' },
  { key: 'Love', en: 'Love', ja: '愛' },
  { key: 'Winking', en: 'Winking', ja: 'ウインク' },
  { key: 'Confused', en: 'Confused', ja: '混乱' },
];

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('pop-art');
  const [generatedStickers, setGeneratedStickers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [isZipping, setIsZipping] = useState(false);
  const [stylesWithRotation, setStylesWithRotation] = useState([]);
  const styleContainerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [showStickerSheetModal, setShowStickerSheetModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const [hasApiKey, setHasApiKey] = useState(false);

  const t = useCallback((key) => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  useEffect(() => {
    const userLang = navigator.language; if (userLang.startsWith('ja')) { setLanguage('ja'); }
    const userAgent = navigator.userAgent;
    setIsAndroid(/android/i.test(userAgent));
    setIsIOS((/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent); if (!isMobile) { setIsDesktop(true); }
    const jszipScript = document.createElement('script'); jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'; jszipScript.async = true; document.body.appendChild(jszipScript);
    const html2canvasScript = document.createElement('script'); html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; html2canvasScript.async = true; document.body.appendChild(html2canvasScript);
    const initialStyles = styleOptions.map(style => ({ ...style, rotation: Math.random() * 12 - 6 })); setStylesWithRotation(initialStyles);
    const effectiveKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '').trim(); setHasApiKey(!!effectiveKey);
    return () => { document.body.removeChild(jszipScript); document.body.removeChild(html2canvasScript); };
  }, []);

  useEffect(() => { if (stream && videoRef.current) { (videoRef.current as any).srcObject = stream; } }, [stream]);

  const checkScrollButtons = useCallback(() => {
    const el = styleContainerRef.current as any; if (el) { const hasOverflow = el.scrollWidth > el.clientWidth; setShowLeftArrow(hasOverflow && el.scrollLeft > 0); setShowRightArrow(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1); }
  }, []);

  useEffect(() => {
    const styleContainer = styleContainerRef.current as any; if (!styleContainer) return; const timer = setTimeout(() => checkScrollButtons(), 100); styleContainer.addEventListener('scroll', checkScrollButtons); window.addEventListener('resize', checkScrollButtons); return () => { clearTimeout(timer); if (styleContainer) { styleContainer.removeEventListener('scroll', checkScrollButtons); } window.removeEventListener('resize', checkScrollButtons); };
  }, [stylesWithRotation, checkScrollButtons]);

  const handleScroll = (direction) => {
    const el = styleContainerRef.current as any; if (!el) return; const items = Array.from((el.children[0] as any).children); if (items.length === 0) return; const containerCenter = el.scrollLeft + el.clientWidth / 2; let targetItem: any; if (direction === 'right') { targetItem = (items as any).find((item: any) => (item.offsetLeft + item.offsetWidth / 2) > containerCenter + 1); if (!targetItem) targetItem = items[items.length - 1]; } else { const candidates = (items as any).filter((item: any) => (item.offsetLeft + item.offsetWidth / 2) < containerCenter - 1); targetItem = candidates[candidates.length - 1]; if (!targetItem) targetItem = items[0]; } if (targetItem) { const targetScrollLeft = targetItem.offsetLeft + (targetItem.offsetWidth / 2) - (el.clientWidth / 2); el.scrollTo({ left: targetScrollLeft, behavior: 'smooth' }); }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => { const base64Data = (reader.result as string).split(',')[1]; resolve(base64Data); }; reader.onerror = (error) => reject(error); });

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0]; if (file && file.type.startsWith('image/')) { const objectUrl = URL.createObjectURL(file); setImagePreview(objectUrl); const base64 = await (fileToBase64 as any)(file); setUploadedImage({ mimeType: file.type, data: base64, url: objectUrl }); setGeneratedStickers([]); setError(null); } else { setError(t('errorInvalidImage')); setUploadedImage(null); setImagePreview(null); }
  }, [t]);

  const openCamera = async () => { if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { try { const newStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } }); setStream(newStream); setShowCameraModal(true); } catch (err) { console.error('Error accessing camera: ', err); setError(t('errorCameraAccess')); } } };
  const closeCamera = () => { if (stream) { stream.getTracks().forEach(track => track.stop()); } setStream(null); setShowCameraModal(false); };
  const handleCapture = () => { const video = videoRef.current as any; const canvas = canvasRef.current as any; if (video && canvas) { const context = canvas.getContext('2d'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); canvas.toBlob((blob) => { if (!blob) return; const file = new File([blob], 'webcam-photo.png', { type: 'image/png' }); const mockEvent = { target: { files: [file] } } as any; (handleImageUpload as any)(mockEvent); }, 'image/png'); closeCamera(); } };

  const forceCharacter = "\n\n**Character** The generated character/person/animal must match the features of the person/character/animal in the uploaded reference image. keep the facial feature, hair style...";
  const forceWhiteBackground = "\n\n**Background:** Plain solid white #FFFFFF background only (no background colors/elements)";
  const skinTonePersistence = "ALWAYS PRESERVE the skin tone / hair style and other distict features of the uploaded character/person.";
  const colorPalletPersistence = "First, describe the distinct features and style of the uploaded image in great detail e.g. hair style name, outfit name, and so on. Also, specify the color of each main element using its hexadecimal (HEX) code.";
  const getGenerationConfig = () => ({
    responseModalities: ['IMAGE'],
    imageConfig: {
      aspectRatio: '1:1',
    },
  });

  const refreshApiKeyPresence = () => { const effectiveKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '').trim(); setHasApiKey(!!effectiveKey); };
  const handleSetApiKey = () => { const current = localStorage.getItem('GEMINI_API_KEY') || ''; const input = window.prompt('Enter Gemini API Key', current); if (input !== null) { localStorage.setItem('GEMINI_API_KEY', input.trim()); refreshApiKeyPresence(); } };

  const getStylePrompt = (style, emotion) => {
    const profilePicInstruction = 'The character should be customized based on the attached profile picture.';
    switch (style) {
      case 'moe-anime':
        return `Create a single sticker in the 'moe-like' anime style. ${profilePicInstruction} The character must express the emotion: '${emotion}'. The art should feature large, expressive eyes, a small and cute mouth and nose, and a generally youthful and endearing appearance. The lines should be clean and the colors bright and soft. The background should be simple, perhaps with some cute patterns or sparkles, ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern.`;
      case 'pop-art':
        return `Create a single sticker in the distinct Pop Art style. ${profilePicInstruction} The character must express the emotion: '${emotion}'. The image should feature bold, thick black outlines around all figures, objects, and text. Utilize a limited, flat color palette consisting of vibrant primary and secondary colors, applied in unshaded blocks, but maintain the person skin tone. Incorporate visible Ben-Day dots or halftone patterns to create shading, texture, and depth. The subject should display a dramatic expression. Include stylized text within speech bubbles or dynamic graphic shapes to represent sound effects (onomatopoeia). The overall aesthetic should be clean, graphic, and evoke a mass-produced, commercial art sensibility with a polished finish. The user's face from the uploaded photo must be the main character, ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern..`;
      case 'claymation':
        return `Create a single sticker in the style of a classic claymation character. ${profilePicInstruction} The character must express the emotion: '${emotion}'. The sticker should feature a claymation character where the picture is made to look like it is made from clay, and an interesting claymation landscape in the background, using the playfulness of claymation to exaggerate certain features depending on the emotion, and with clay-like sculpting of the face visible when expressing different emotions, ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern.`;
      case 'cartoon-dino':
        return `Create a single sticker of an anthropomorphized cartoon dinosaur. ${profilePicInstruction} The character's face, customized from the attached profile picture, must express the emotion: '${emotion}'. The style should be cute and whimsical with bright, cheerful colors and a simple background suitable for a messaging app, ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern.`;
      case 'pixel-art':
        return `Create a single sticker in the style of a retro Pixel Art piece. ${profilePicInstruction} The character must express the emotion: '${emotion}'. The pixel art should be colorful, abstract, slightly retro-futuristic, combining 8 bit and glitch elements, and incorporating additional icons or accessories that represent the intended emotion, ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern..`;
      case 'sticker-bomb':
        return `Stylize and augment the user pic in a stickerbomb style. ${profilePicInstruction} The character must express the emotion: '${emotion}'. Stickerbomb style with colorful graphic stickers surrounding the users face, also reflecting the emotion depicted, ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern. The user's face should always be in a cartoonish style like the surrounding stickers, and never show in a photorealistic style.`;
      case 'football-sticker':
        return `Generate a single sticker in the style of vintage 1970s soccer trading cards ${profilePicInstruction} The character must express the emotion: '${emotion}'.  The sticker should feature a headshot or upper torso portrait of a football player or manager Optionally, include a small, stylized team crest or a retro club name banner at the top. The entire sticker should have a clean, defined border and a slightly aged or matte finish to evoke a nostalgic, collectible feel.`;
      case 'vintage-bollywood':
        return `Change my image to a 1960's retro Bollywood themed poster. ${profilePicInstruction} Generate a poster with emotion: '${emotion}'.`;
      case 'japanese-matchbox':
        return `Make a single sticker in Japanese Showa-era matchbox art . ${profilePicInstruction} The character must express the emotion: '${emotion}'. Make a sticker in Japanese Showa-era matchbox art of a cat drinking coffee, retro graphic design, limited color palette, distressed paper texture and a retro-futuristic rocket ship, design for a 1960s Japanese matchbox label. Showa kitsch illustration of a person winking, simple lines, 2-color print style., ideally with an interesting outline shape that is not square or circular but closer to a dye-cut pattern.`;
      case 'royal':
        return `Create a single sticker transforming the pic into royalty - a king, queen, prince or princess - with unicorns and rainbows. ${profilePicInstruction} The character must express the emotion: '${emotion}'. The image should feature a cool looking king, queen, prince or cute princess along with augmenting aces, spades, diamonds, hearts, unicorns, rainbows and clouds, ideally with an interesting outline shape that is not square or circular but closer to a die-cut pattern. The user's face should always be in a cartoonish style like the surrounding stickers, and never show in a photorealistic style.`;
      default:
        return `Create a sticker of a person expressing '${emotion}' in a ${style} style, based on the uploaded photo.`;
    }
  };

  const makeApiCallWithRetry = async (payload, emotion) => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || storedKey || '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
    let attempt = 0; const maxAttempts = 3; const initialDelay = 1000;
    while (attempt < maxAttempts) {
      try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error?.message || `API request failed with status ${response.status}`); }
        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        if (base64Data) { return { emotion, imageUrl: `data:image/png;base64,${base64Data}` }; }
        const safetyError = result?.promptFeedback?.blockReason; throw new Error(safetyError ? `Generation blocked: ${safetyError}`: 'No image data in response.');
      } catch (err: any) {
        console.error(`Attempt ${attempt + 1} for emotion '${emotion}' failed:`, err); attempt++; if (attempt >= maxAttempts) { return { emotion, imageUrl: null, error: err.message }; }
        await new Promise(res => setTimeout(res, initialDelay * Math.pow(2, attempt)));
      }
    }
    return { emotion, imageUrl: null, error: 'Max retries reached.' };
  };

  const generateStickers = async () => {
    if (!uploadedImage) { setError(t('errorUploadProfilePic')); return; }
    if (!hasApiKey) { setError('Please set API key'); return; }
    setIsLoading(true); setError(null);
    setGeneratedStickers(Array(emotions.length).fill(null).map((_, i) => ({ emotion: emotions[i].key, isLoading: true })));
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    try {
      for (let i = 0; i < emotions.length; i++) {
        const emotion = emotions[i].key;
        setLoadingMessage(`${t('generatingStickers')} (${i + 1}/${emotions.length})`);
        const userPrompt = getStylePrompt(selectedStyle, emotion);
        let fullPrompt = '';
        switch (selectedStyle) {
          case 'vintage-bollywood': fullPrompt = colorPalletPersistence + userPrompt + skinTonePersistence; break;
          case 'cartoon-dino': fullPrompt = colorPalletPersistence + userPrompt + forceWhiteBackground; break;
          default: fullPrompt = colorPalletPersistence + userPrompt + forceCharacter + forceWhiteBackground + skinTonePersistence;
        }
        const payload = { contents: [{ parts: [{ text: fullPrompt }, { inlineData: { mimeType: uploadedImage.mimeType, data: uploadedImage.data } }] }], generationConfig: getGenerationConfig() } as any;
        const result = await makeApiCallWithRetry(payload, emotion);
        setGeneratedStickers(prev => {
          const next = [...prev];
          next[i] = { ...result, isLoading: false } as any;
          return next;
        });
        await sleep(1200);
      }
    } catch (err) {
      console.error('An unexpected error occurred during sticker generation:', err);
      setError(t('errorOccurred'));
    } finally {
      setIsLoading(false); setLoadingMessage('');
    }
  };

  const handleRegenerate = async (emotionToRegenerate) => {
    if (!uploadedImage) return; setGeneratedStickers(prev => prev.map(s => s.emotion === emotionToRegenerate ? { ...s, isLoading: true, imageUrl: null } : s)); setError(null);
    const userPrompt = getStylePrompt(selectedStyle, emotionToRegenerate);
    let fullPrompt = '';
    switch (selectedStyle) { case 'vintage-bollywood': fullPrompt = colorPalletPersistence + userPrompt + skinTonePersistence; break; case 'cartoon-dino': fullPrompt = colorPalletPersistence + userPrompt + forceWhiteBackground; break; default: fullPrompt = colorPalletPersistence + userPrompt + forceCharacter + forceWhiteBackground + skinTonePersistence; }
    const payload = { contents: [{ parts: [{ text: fullPrompt }, { inlineData: { mimeType: uploadedImage.mimeType, data: uploadedImage.data } }] }], generationConfig: getGenerationConfig() } as any;
    const result = await makeApiCallWithRetry(payload, emotionToRegenerate);
    setGeneratedStickers(prev => prev.map(s => s.emotion === emotionToRegenerate ? { ...result, isLoading: false } : s));
  };

  const handleDownloadSingle = (imageUrl, emotion) => {
    try { const link = document.createElement('a'); link.href = imageUrl; link.download = `sticker-${emotion.toLowerCase()}.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link); }
    catch (e) { console.error('Error downloading sticker:', e); setError(t('errorDownloadSticker')); }
  };

  const handleDownloadAll = async () => {
    if (typeof (window as any).JSZip === 'undefined') { setError(t('errorDownloadAll')); return; }
    const stickersToDownload = generatedStickers.filter(s => s.imageUrl); if (stickersToDownload.length === 0) return; setIsZipping(true); setError(null);
    try { const zip = new (window as any).JSZip(); stickersToDownload.forEach(sticker => { const base64Data = sticker.imageUrl.split(',')[1]; zip.file(`sticker-${sticker.emotion.toLowerCase()}.png`, base64Data, { base64: true }); }); const zipBlob = await zip.generateAsync({ type: 'blob' }); const link = document.createElement('a'); link.href = URL.createObjectURL(zipBlob); link.download = 'GemStickers.zip'; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href); }
    catch (err) { console.error('Error creating zip file:', err); setError(t('errorZip')); }
    finally { setIsZipping(false); }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex items-center justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;700&display=swap'); .font-googlesans { font-family: 'Google Sans', sans-serif; } .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <div className="container mx-auto max-w-5xl w-full bg-white rounded-2xl shadow-2xl p-0 overflow-hidden relative">
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button onClick={handleSetApiKey} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-md py-2 px-3 border-2 border-gray-300 shadow-sm hover:bg-white transition">{hasApiKey ? 'Change API Key' : 'Set API Key'}</button>
          <select onChange={(e) => setLanguage(e.target.value)} value={language} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-md py-2 px-3 border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
        <header className="relative h-64 md:h-72 bg-[#F2EFEF] overflow-hidden">
          <img className="absolute h-full w-full object-cover" src="https://gstatic.com/synthidtextdemo/images/gemstickers/header/bg_header.png" alt="Header background" />
          <img className="hidden md:block absolute h-32 object-contain -left-8 rotate-12" src="https://gstatic.com/synthidtextdemo/images/gemstickers/dot/football.png" alt="Football sticker"/>
          <img className="hidden md:block absolute h-32 object-contain left-28 -top-12" src="https://gstatic.com/synthidtextdemo/images/gemstickers/dot/claymation.png" alt="Claymation sticker" />
          <img className="hidden md:block absolute h-24 object-contain left-16" src="https://gstatic.com/synthidtextdemo/images/gemstickers/dot/pixel.png" alt="Pixel art sticker" />
          <img className="hidden md:block absolute h-32 md:h-48 object-contain right-2 md:right-4 -top-8 -rotate-6" src="https://gstatic.com/synthidtextdemo/images/gemstickers/dot/matchbox.png" alt="Matchbox sticker" />
          <img className="hidden md:block absolute h-28 object-contain right-16 bottom-16 rotate-12" src="https://gstatic.com/synthidtextdemo/images/gemstickers/dot/pop_art.png" alt="Pop art sticker"/>
          <img className="hidden md:block absolute h-32 md:h-48 object-contain -right-8 md:-right-4 -bottom-8 md:-bottom-12 -rotate-12" src="https://gstatic.com/synthidtextdemo/images/gemstickers/header/sticker_sample_0.png" alt="Sticker sample"/>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col w-5/6 md:w-2/3">
            <img className="object-contain h-32 md:h-48 -mt-8" src="https://gstatic.com/synthidtextdemo/images/gemstickers/header/gemsticker_logo_3.png" />
            <p className="-mt-4 md:-mt-8 font-medium text-xs md:text-sm italic text-end">{t('appSubtitle')}</p>
          </div>
          <img className="hidden md:block absolute h-48 object-contain -bottom-7 left-1/3 -translate-x-5" src="https://www.gstatic.com/synthidtextdemo/images/gemstickers/4x/moe_anime.png" alt="Anime sticker"/>
        </header>
        <div className="grid grid-cols-1 gap-8 md:p-0 lg:p-6 mt-8">
          <div className="flex flex-col space-y-8">
            <div className="relative w-full sm-w-2/3 md:w-1/2 mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input id="camera-upload" type="file" className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
                <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {(isAndroid || isIOS) && (
                  <label htmlFor="camera-upload" className="cursor-pointer w-full border-2 border-[#342D28CC] text-black font-semibold py-2 px-6 rounded-lg text-base shadow-sm transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                    <CameraIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span>{imagePreview ? t('retakePhoto') : t('takePhoto')}</span>
                  </label>
                )}
                {isDesktop && (
                  <button onClick={openCamera} className="cursor-pointer w-full border-2 border-[#342D28CC] text-black font-semibold py-2 px-6 rounded-lg text-base shadow-sm transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                    <CameraIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span>{imagePreview ? t('retakeWebcam') : t('useWebcam')}</span>
                  </button>
                )}
                <label htmlFor="image-upload" className="cursor-pointer w-full border-2 border-[#342D28CC] text-black font-semibold py-2 px-6 rounded-lg text-base shadow-sm transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                  <UploadCloud className="w-6 h-6 mr-3 flex-shrink-0" />
                  <span>{imagePreview ? t('changePhoto') : t('uploadPhoto')}</span>
                </label>
              </div>
              {imagePreview && (<img src={imagePreview} alt="Uploaded preview" className="h-16 w-16 object-cover rounded-md shadow-lg absolute right-0 -top-8 -rotate-12 border-2 border-black bg-white" />)}
            </div>
            <div className="flex flex-col justify-center items-center w-full">
              <h2 className="text-xl font-semibold text-black">{t('chooseStyle')}</h2>
              <div className="relative w-full">
                <button onClick={() => handleScroll('left')} className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-opacity duration-300 focus:outline-none ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Scroll left"><ChevronLeft className="w-6 h-6 text-gray-800" /></button>
                <div ref={styleContainerRef} className="flex flex-row items-center w-full h-[360px] overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar">
                  <div className="flex flex-row items-center w-auto px-4 mb-24">
                    {stylesWithRotation.map((style: any, index: number) => (
                      <button key={style.id} onClick={() => setSelectedStyle(style.id)} className={`p-2 -mx-8 text-xs rounded-lg text-black font-semibold focus:outline-none focus:ring-0 active:outline-none active:ring-0 transition-transform duration-200 hover:scale-110 hover:z-10 flex-shrink-0`} style={{ transform: `rotate(${style.rotation}deg) translateY(${index % 2 === 0 ? '0' : '4rem'})` }}>
                        <div className={`w-48 m-0`}>
                          <img className={`w-48 object-contain overflow-visible m-0`} src={selectedStyle === style.id ? style.selectedImgUrl : style.imgUrl} alt={style[language] || style['en']} />
                          <p className={`text-center ${selectedStyle === style.id ? 'font-bold' : ''}`}>{style[language] || style['en']}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleScroll('right')} className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-opacity duration-300 focus:outline-none ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Scroll right"><ChevronRight className="w-6 h-6 text-gray-800" /></button>
              </div>
            </div>
            <div>
              <button onClick={generateStickers} disabled={!uploadedImage || isLoading} className="w-1/2 font-semibold mx-auto text-black py-2 px-6 border-2 border-black rounded-lg text-lg transition-transform transform hover:scale-105 duration-300 disabled:bg-[#F8F8F8] disabled:border-2 disabled:border-[#C3C3C3] disabled:text-[#C3C3C3] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center whitespace-nowrap">
                {isLoading ? (<><LoaderCircle className="animate-spin w-6 h-6 mr-3" />{loadingMessage || t('generating')}</>) : (t('createStickers'))}
              </button>
            </div>
          </div>
          <div className="bg-[#F8F8F8] rounded-lg p-6 flex items-center justify-center min-h-[400px]">
            {isLoading && (<div className="text-center text-gray-600"><LoaderCircle className="w-16 h-16 animate-spin mx-auto mb-4" /><p className="text-xl font-medium">{loadingMessage || t('generatingMagic')}</p><p>{t('magicMoment')}</p></div>)}
            {error && (<div className="text-center text-red-600 bg-red-100 p-6 rounded-lg"><AlertTriangle className="w-16 h-16 mx-auto mb-4" /><p className="text-xl font-bold">{t('errorOccurred')}</p><p className="mt-2">{error}</p></div>)}
            {!isLoading && !error && generatedStickers.length > 0 && (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {generatedStickers.map((sticker: any, index: number) => {
                    const emotionObject = emotions.find(e => e.key === sticker.emotion) as any; const emotionName = emotionObject ? emotionObject[language] : sticker.emotion;
                    return sticker.isLoading ? (
                      <div key={index} className="text-center p-4 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center aspect-square bg-gray-100">
                        <LoaderCircle className="w-8 h-8 text-gray-500 animate-spin mb-2"/>
                        <p className="text-sm font-semibold text-gray-700">{t('generatingPlaceholder')}</p>
                        <p className="text-xs text-gray-600">{emotionName}</p>
                      </div>
                    ) : sticker.imageUrl ? (
                      <div key={index} className="text-center group relative">
                        <button onClick={() => { setModalImageUrl(sticker.imageUrl); setShowImageModal(true); }} className="block bg-white rounded-3xl overflow-hidden shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <img src={sticker.imageUrl} alt={`Sticker of ${sticker.emotion}`} className="w-full h-auto aspect-square object-cover" />
                        </button>
                        <div className="absolute bottom-8 p-1 left-1/2 -translate-x-1/2 rounded-full bg-white border border-[#C3C3C3] flex items-center space-x-1.5">
                          <button onClick={() => handleDownloadSingle(sticker.imageUrl, sticker.emotion)} className="p-1.5 bg-white/80 rounded-full hover:bg-white transition duration-300" title="Download this sticker"><DownloadIcon className="w-4 h-4 text-gray-700" /></button>
                          <div className="border w-0 h-[1rem] border-[#c3c3c3]"></div>
                          <button onClick={() => handleRegenerate(sticker.emotion)} className="p-1.5 bg-white/80 rounded-full hover:bg-white transition duration-300" title="Regenerate this sticker"><RefreshIcon className="w-4 h-4 text-gray-700" /></button>
                        </div>
                        <p className="mt-10 text-sm font-medium text-gray-700">{emotionName}</p>
                      </div>
                    ) : (
                      <div key={index} className="text-center p-4 border-2 border-dashed border-red-400 rounded-lg flex flex-col items-center justify-center aspect-square bg-red-50">
                        <AlertTriangle className="w-8 h-8 text-red-500 mb-2"/>
                        <p className="text-sm font-semibold text-red-700">{t('failedPlaceholder')}</p>
                        <p className="text-xs text-red-600">{emotionName}</p>
                        <button onClick={() => handleRegenerate(sticker.emotion)} className="mt-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors whitespace-nowrap">{t('retry')}</button>
                      </div>
                    );
                  })}
                </div>
                {generatedStickers.some((s: any) => s.imageUrl) && (
                  <div className="mt-8 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button onClick={() => setShowStickerSheetModal(true)} className="w-full sm:w-auto bg-white text-[#5A544E] border-2 border-[#5A544E] font-medium py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 flex items-center justify-center whitespace-nowrap">{t('viewStickerSheet')}</button>
                      <button onClick={handleDownloadAll} disabled={isZipping} className="w-full sm:w-auto bg-[#5A544E] text-white font-medium py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center whitespace-nowrap">
                        {isZipping ? (<><LoaderCircle className="animate-spin w-6 h-6 mr-3" /> {t('zipping')}</>) : (<><DownloadIcon className="w-6 h-6 mr-2" /> {t('downloadAll')}</>)}
                      </button>
                    </div>
                    {isIOS && (<div className="mt-4 p-3 bg-gray-200 rounded-lg text-gray-700 max-w-md mx-auto"><p className="font-semibold text-sm"><span className="text-blue-500 mr-2">{t('tip')}</span>{t('iosTip')}</p></div>)}
                  </div>
                )}
              </div>
            )}
            {!isLoading && !error && generatedStickers.length === 0 && (<div className="text-center text-gray-500"><p className="text-xl font-medium">{t('stickersAppearHere')}</p><p>{t('followSteps')}</p></div>)}
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <CameraModal show={showCameraModal} onClose={closeCamera} onCapture={handleCapture} videoRef={videoRef} t={t} />
        <ImageModal show={showImageModal} onClose={() => setShowImageModal(false)} imageUrl={modalImageUrl} t={t} />
        <StickerSheetModal show={showStickerSheetModal} onClose={() => setShowStickerSheetModal(false)} stickers={generatedStickers} uploadedImage={uploadedImage?.url} isIOS={isIOS} isAndroid={isAndroid} t={t} />
      </div>
    </div>
  );
}


