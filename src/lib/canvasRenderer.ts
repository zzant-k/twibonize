import { TwibbonTemplate, PhotoTransform } from '../types/template';

/**
 * Menghitung skala dasar "cover" agar foto memenuhi area canvas
 */
export function calculateBaseCoverScale(
  targetWidth: number,
  targetHeight: number,
  photoWidth: number,
  photoHeight: number
): number {
  if (photoWidth <= 0 || photoHeight <= 0) return 1.0;
  return Math.max(targetWidth / photoWidth, targetHeight / photoHeight);
}

export interface RenderLayersOptions {
  ctx: CanvasRenderingContext2D;
  template: TwibbonTemplate;
  frameImage: HTMLImageElement | null;
  photoImage: HTMLImageElement | null;
  transform: PhotoTransform;
  renderScale?: number; // Skala rendering jika preview (default: 1.0)
}

/**
 * Render semua layer twibbon dengan koordinat logis seragam.
 * Digunakan untuk Interactive Canvas Preview maupun Final High-Res Export.
 */
export function renderTwibbonLayers({
  ctx,
  template,
  frameImage,
  photoImage,
  transform,
  renderScale = 1.0,
}: RenderLayersOptions): void {
  const { outputWidth, outputHeight } = template;

  ctx.save();
  ctx.scale(renderScale, renderScale);

  // Bersihkan canvas
  ctx.clearRect(0, 0, outputWidth, outputHeight);

  // Aktifkan smoothing berkualitas tinggi
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // ==========================================
  // LAYER 1: Background dasar (jika diperlukan)
  // ==========================================
  // Default transparan

  // ==========================================
  // LAYER 2: Foto Pengguna
  // ==========================================
  if (photoImage && photoImage.complete && photoImage.naturalWidth > 0) {
    ctx.save();

    // Jika template memiliki photoArea clipping khusus (e.g. circle atau rounded)
    if (template.photoArea) {
      const pa = template.photoArea;
      const x = (pa.xPercent ?? 0) * (outputWidth / 100);
      const y = (pa.yPercent ?? 0) * (outputHeight / 100);
      const w = (pa.widthPercent ?? 100) * (outputWidth / 100);
      const h = (pa.heightPercent ?? 100) * (outputHeight / 100);

      ctx.beginPath();
      if (pa.shape === 'circle') {
        const radius = Math.min(w, h) / 2;
        ctx.arc(x + w / 2, y + h / 2, radius, 0, Math.PI * 2);
      } else if (pa.shape === 'rounded' && pa.borderRadius) {
        ctx.roundRect(x, y, w, h, pa.borderRadius);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.clip();
    }

    const pWidth = photoImage.naturalWidth;
    const pHeight = photoImage.naturalHeight;

    const pa = template.photoArea;
    const targetW = pa ? ((pa.widthPercent ?? 100) * outputWidth) / 100 : outputWidth;
    const targetH = pa ? ((pa.heightPercent ?? 100) * outputHeight) / 100 : outputHeight;
    const targetCenterX = pa
      ? (((pa.xPercent ?? 0) + (pa.widthPercent ?? 100) / 2) * outputWidth) / 100
      : outputWidth / 2;
    const targetCenterY = pa
      ? (((pa.yPercent ?? 0) + (pa.heightPercent ?? 100) / 2) * outputHeight) / 100
      : outputHeight / 2;

    const baseScale = calculateBaseCoverScale(targetW, targetH, pWidth, pHeight);
    const totalScale = baseScale * transform.scale;

    // Posisikan foto di pusat area target ditambah offset pergeseran pengguna
    ctx.translate(
      targetCenterX + transform.offsetX,
      targetCenterY + transform.offsetY
    );

    if (transform.rotation !== 0) {
      ctx.rotate((transform.rotation * Math.PI) / 180);
    }

    ctx.scale(totalScale, totalScale);

    // Gambar foto terpusat
    ctx.drawImage(
      photoImage,
      -pWidth / 2,
      -pHeight / 2,
      pWidth,
      pHeight
    );

    ctx.restore();
  }

  // ==========================================
  // LAYER 3: Frame PNG Transparan
  // ==========================================
  if (frameImage && frameImage.complete && frameImage.naturalWidth > 0) {
    ctx.drawImage(frameImage, 0, 0, outputWidth, outputHeight);
  }

  ctx.restore();
}
