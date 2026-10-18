export interface ShareCapabilities {
  canShare: boolean;
  canShareFiles: boolean;
}

/**
 * Mengecek apakah browser mendukung Web Share API untuk file dan teks
 */
export function checkShareSupport(file?: File): ShareCapabilities {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return { canShare: false, canShareFiles: false };
  }

  let canShareFiles = false;
  if (file && navigator.canShare) {
    try {
      canShareFiles = navigator.canShare({ files: [file] });
    } catch {
      canShareFiles = false;
    }
  }

  return {
    canShare: true,
    canShareFiles,
  };
}

export interface ShareOptions {
  file: File;
  title: string;
  text?: string;
  url?: string;
}

export type ShareResult =
  | { success: true; method: 'web-share' }
  | { success: false; cancelled: true }
  | { success: false; cancelled: false; error: string; unsupported?: boolean };

/**
 * Membagikan twibbon menggunakan Web Share API jika didukung
 */
export async function shareTwibbon({
  file,
  title,
  text,
  url,
}: ShareOptions): Promise<ShareResult> {
  const capabilities = checkShareSupport(file);

  if (!capabilities.canShare) {
    return {
      success: false,
      cancelled: false,
      unsupported: true,
      error: 'Browser ini belum mendukung fitur berbagi file langsung.',
    };
  }

  try {
    const shareData: ShareData = {
      title,
      text: text || title,
    };

    if (capabilities.canShareFiles) {
      shareData.files = [file];
    } else if (url) {
      shareData.url = url;
    }

    await navigator.share(shareData);
    return { success: true, method: 'web-share' };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      // Pengguna membatalkan dialog share (bukan error sistem)
      return { success: false, cancelled: true };
    }
    const message = err instanceof Error ? err.message : 'Gagal membagikan twibbon.';
    return { success: false, cancelled: false, error: message };
  }
}

/**
 * Menyalin teks caption ke clipboard
 */
export async function copyCaptionToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback untuk browser lama
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Membuka tautan Instagram
 */
export function openInstagram(): void {
  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
}
