export interface ActiveCampaign {
  id: string;
  name: string;
  frameBlobUrl?: string;
  frameBlob?: Blob;
  aspectRatio: '1:1' | '4:5' | '9:16' | string;
  outputWidth: number;
  outputHeight: number;
  defaultCaption: string;
  allowCaption: boolean;
  updatedAt: number;
}

const DB_NAME = 'TwibbonStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'campaign';
const CAMPAIGN_KEY = 'active_twibbon';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB tidak didukung pada browser ini.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Menyimpan kampanye twibbon aktif beserta file Blob frame-nya ke IndexedDB
 */
export async function saveActiveCampaign(campaign: ActiveCampaign): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    // Simpan tanpa URL sementara karena URL objek harus dibuat ulang saat dimuat
    const toSave = {
      ...campaign,
      frameBlobUrl: undefined,
    };
    const req = store.put(toSave, CAMPAIGN_KEY);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Memuat kampanye twibbon aktif dari IndexedDB
 */
export async function getActiveCampaign(): Promise<ActiveCampaign | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(CAMPAIGN_KEY);

      req.onsuccess = () => {
        const result = req.result as ActiveCampaign | undefined;
        if (!result) {
          resolve(null);
          return;
        }

        // Jika terdapat frameBlob, buat Object URL yang valid untuk sesi ini
        let blobUrl: string | undefined;
        if (result.frameBlob) {
          blobUrl = URL.createObjectURL(result.frameBlob);
        }

        resolve({
          ...result,
          frameBlobUrl: blobUrl,
        });
      };

      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/**
 * Menghapus kampanye kustom dari IndexedDB dan kembali ke default
 */
export async function resetActiveCampaign(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(CAMPAIGN_KEY);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
