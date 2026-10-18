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
    frameUrl: '/frames/twibon.png',
    previewUrl: '/frames/previews/twibon.png',
    aspectRatio: '1276:2022',
    outputWidth: 1276,
    outputHeight: 2022,
    defaultCaption: "I'M READY FOR LKMM-D 2026! 🎮⚡ Level up and ready for the journey! #LKMMD2026 #LevelUp",
    allowCaption: false,
    photoArea: {
      shape: 'rect',
      xPercent: 6.42,
      yPercent: 17.95,
      widthPercent: 86.68,
      heightPercent: 53.41,
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
