import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  twibbonTitle: string;
  onBackToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ twibbonTitle, onBackToHome }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#141517] border-b border-white/[0.08] text-white backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand Wordmark & Campaign Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center text-[#141517] shadow-sm shrink-0 transition-colors focus:outline-none"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <Layers className="w-4 h-4 text-[#141517]" />
          </button>

          <div className="flex flex-col min-w-0 text-left">
            <span className="font-semibold text-sm tracking-tight text-white leading-tight shrink-0">
              Twibbon Studio
            </span>
            <span className="text-[11px] text-gray-400 font-medium tracking-normal truncate">
              {twibbonTitle}
            </span>
          </div>
        </div>

        {/* Back to Home Button (Continuous Pill) */}
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="btn-pill btn-pill-secondary h-8 px-3.5 text-xs font-medium gap-1.5 min-h-[32px]"
            title="Kembali ke Beranda"
          >
            <span className="pill-specular" aria-hidden="true" />
            <span className="btn-label gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
