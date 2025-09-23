export {};

declare global {
  interface Window {
    JSZip?: any;
    html2canvas?: any;
    MSStream?: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};

declare global {
  interface Window {
    JSZip?: any;
    html2canvas?: any;
    MSStream?: any;
  }
}


