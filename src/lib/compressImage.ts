/**
 * Kompresi gambar twibbon di sisi browser sebelum diunggah ke Supabase Storage.
 * Mengubah resolusi penuh menjadi thumbnail WebP super hemat (~30 - 50 KB).
 */

export interface CompressionResult {
  blob: Blob;
  sizeKB: number;
  width: number;
  height: number;
}

export async function compressTwibbonThumbnail(
  sourceCanvas: HTMLCanvasElement,
  targetWidth = 420,
  quality = 0.75
): Promise<CompressionResult> {
  const origWidth = sourceCanvas.width;
  const origHeight = sourceCanvas.height;

  // Hitung tinggi proporsional mengikuti rasio asli (1276:2022)
  const targetHeight = Math.round((targetWidth / origWidth) * origHeight);

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = targetWidth;
  thumbCanvas.height = targetHeight;

  const ctx = thumbCanvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Gagal menginisialisasi context canvas untuk kompresi.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Berikan background putih bersih untuk format kompresi
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Gambar twibbon yang sudah terkomposisi ke canvas kecil
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  // Coba export ke format WebP (modern & sangat kecil), fallback ke JPEG
  return new Promise((resolve, reject) => {
    thumbCanvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback ke JPEG jika WebP tidak didukung
          thumbCanvas.toBlob(
            (jpegBlob) => {
              if (!jpegBlob) {
                reject(new Error('Gagal mengompres gambar twibbon.'));
                return;
              }
              resolve({
                blob: jpegBlob,
                sizeKB: Math.round(jpegBlob.size / 1024),
                width: targetWidth,
                height: targetHeight,
              });
            },
            'image/jpeg',
            quality
          );
          return;
        }

        resolve({
          blob,
          sizeKB: Math.round(blob.size / 1024),
          width: targetWidth,
          height: targetHeight,
        });
      },
      'image/webp',
      quality
    );
  });
}
