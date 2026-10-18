import React from 'react';
import { ArrowDown, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-apple-border/40">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-apple-surface/60 via-white to-white pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-surface border border-apple-border/60 text-apple-secondary text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Personal Twibbon Studio • Kualitas Desain Apple</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-apple-text leading-[1.08] mb-6">
          Buat Foto, <br className="hidden sm:inline" />
          <span className="text-apple-text">Ceritakan Momen.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-apple-secondary leading-relaxed mb-8">
          Pilih frame favoritmu, sesuaikan foto dengan kontrol drag &amp; pinch yang presisi,
          tambahkan caption, lalu unduh dalam resolusi penuh tanpa penurunan kualitas.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onStartClick}
            rightIcon={<ArrowDown className="w-4 h-4" />}
          >
            Mulai Membuat
          </Button>
        </div>

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-apple-border/30 text-left">
          <div className="flex items-start gap-3 p-3 rounded-apple bg-apple-surface/50 border border-apple-border/30">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-apple-blue flex items-center justify-center shrink-0 mt-0.5">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-apple-text">Kontrol Interaktif Presisi</h3>
              <p className="text-[11px] text-apple-secondary mt-0.5 leading-snug">
                Geser dengan sentuhan atau mouse, zoom slider, dan pinch-to-zoom responsif.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-apple bg-apple-surface/50 border border-apple-border/30">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-apple-text">Privasi 100% Terjaga</h3>
              <p className="text-[11px] text-apple-secondary mt-0.5 leading-snug">
                Foto Anda tidak pernah diunggah ke server. Seluruh proses terjadi di browser.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-apple bg-apple-surface/50 border border-apple-border/30">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-apple-text">Ekspor Resolusi Penuh</h3>
              <p className="text-[11px] text-apple-secondary mt-0.5 leading-snug">
                Hasil PNG tajam mengikuti ukuran asli template tanpa watermark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
