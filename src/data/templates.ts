import { TwibbonTemplate } from '../types/template';

/**
 * Konfigurasi Terpusat Template Frame Twibbon Studio.
 * Frame utama permanen: LKMM-D 2026 (Pokédex Gaming Console Edition).
 */
export const TEMPLATES: TwibbonTemplate[] = [
  {
    id: 'lkmm-d-2026',
    name: 'LKMM-D 2026 — Level Up',
    description: 'Frame resmi LKMM-D 2026 bertema retro gaming console Pokédex.',
    category: 'LKMM-D',
    frameUrl: '/frames/twibon_v2.png',
    previewUrl: '/frames/previews/twibon_v2.png',
    aspectRatio: '1:1',
    outputWidth: 1080,
    outputHeight: 1350,
    defaultCaption: " 🎮 LEVEL UP: LKMMD 2026\n\nHey, I'm [Nama Panggilan]! Ready to level up with HIMATIF \nPerjalanan baru dimulai! Saatnya saling mengenal, membangun solidaritas, dan bertumbuh bersama menjadi kader yang berintegritas, bertanggung jawab, serta siap berkontribusi untuk HIMATIF🔥 \n\n Are you ready to take the next level? \n#HIMATIF #LKMMD2026 #LevelUp #Informatika",
    allowCaption: false,
    photoArea: {
      shape: 'rect',
      xPercent: 5.0,
      yPercent: 15.1,
      widthPercent: 81.6,
      heightPercent: 50.1,
    },
    isPublished: true,
  },
];

/**
 * Mendapatkan semua template yang telah dipublikasikan
 */
export function getPublishedTemplates(): TwibbonTemplate[] {
  return TEMPLATES.filter((t) => t.isPublished);
}

/**
 * Mencari template berdasarkan ID
 */
export function getTemplateById(id: string): TwibbonTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id && t.isPublished);
}

/**
 * Mengambil daftar kategori unik dari template yang dipublikasikan
 */
export function getAvailableCategories(): string[] {
  const published = getPublishedTemplates();
  const set = new Set<string>();
  published.forEach((t) => set.add(t.category));
  return Array.from(set);
}
