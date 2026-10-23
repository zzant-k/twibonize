import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Participant {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

/**
 * Cek apakah konfigurasi Supabase sudah terisi di .env
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
}

// Inisialisasi client Supabase secara aman (hanya jika konfigurasi tersedia)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Mengambil daftar riwayat peserta dari Supabase
 * @param limit Batas jumlah peserta yang diambil (opsional, jika tidak diberikan akan mengambil semua riwayat tanpa dibatasi 40)
 */
export async function fetchParticipants(limit?: number): Promise<Participant[]> {
  if (!supabase || !isSupabaseConfigured()) {
    return [];
  }

  try {
    let query = supabase
      .from('participants')
      .select('id, name, image_url, created_at')
      .order('created_at', { ascending: false });

    if (typeof limit === 'number' && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Gagal memuat peserta dari Supabase:', error.message);
      return [];
    }

    return (data as Participant[]) || [];
  } catch (err) {
    console.warn('Error fetching participants:', err);
    return [];
  }
}

export interface UploadParticipantOptions {
  name?: string;
  compressedBlob: Blob;
}

/**
 * Mengunggah gambar terkompresi ke Supabase Storage dan mencatat nama ke tabel database
 */
export async function uploadParticipantTwibbon({
  name,
  compressedBlob,
}: UploadParticipantOptions): Promise<{ success: boolean; data?: Participant; error?: string }> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase belum dikonfigurasi. Harap isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const fileName = `lkmm-d-${timestamp}-${randomSuffix}.webp`;
    const bucketName = 'twibbons';

    // 1. Upload file kecil (~40KB) ke Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Dapatkan Public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;
    const participantName = name?.trim() || 'Peserta LKMM-D';

    // 3. Masukkan ke tabel 'participants'
    const { data: insertData, error: insertError } = await supabase
      .from('participants')
      .insert([
        {
          name: participantName,
          image_url: imageUrl,
        },
      ])
      .select('id, name, image_url, created_at')
      .single();

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      data: insertData as Participant,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan ke riwayat peserta.';
    console.error('Upload participant error:', message);
    return {
      success: false,
      error: message,
    };
  }
}
