import { TwibbonTemplate, PhotoTransform } from '../types/template';
import { renderTwibbonLayers } from './canvasRenderer';

export interface ExportResult {
  blob: Blob;
  file: File;
  objectUrl: string;
  filename: string;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
}

export interface ExportOptions {
  template: TwibbonTemplate;
  frameImage: HTMLImageElement;
  photoImage: HTMLImageElement;
  transform: PhotoTransform;
}

/**
 * Render twibbon pada resolusi penuh asli dan hasilkan Blob PNG
 */
export async function generateTwibbonExport({
  template,
  frameImage,
  photoImage,
  transform,
}: ExportOptions): Promise<ExportResult> {
  const { outputWidth, outputHeight, id } = template;

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d', {
    alpha: true,
    willReadFrequently: false,
  });

  if (!ctx) {
    throw new Error('Gagal menginisialisasi context Canvas 2D untuk ekspor.');
  }

  // Render layer dengan resolusi asli (skala 1.0)
  renderTwibbonLayers({
    ctx,
    template,
    frameImage,
    photoImage,
    transform,
    renderScale: 1.0,
  });

  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `twibbon-${id}-${timestamp}.png`;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Gagal menghasilkan file gambar dari kanvas ekspor.'));
        return;
      }

      const file = new File([blob], filename, { type: 'image/png' });
      const objectUrl = URL.createObjectURL(blob);

      resolve({
        blob,
        file,
        objectUrl,
        filename,
        width: outputWidth,
        height: outputHeight,
        canvas,
      });
    }, 'image/png');
  });
}

/**
 * Memicu pengunduhan file gambar ke browser pengguna
 */
export function triggerFileDownload(objectUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  // Bersihkan elemen DOM
  setTimeout(() => {
    document.body.removeChild(anchor);
  }, 100);
}
