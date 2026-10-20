import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  twibbonTitle: string;
  onBackToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ twibbonTitle, onBackToHome }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#141414] border-b border-[#242424] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand Wordmark & Campaign Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center text-[#141414] shadow-sm shrink-0 transition-colors focus:outline-none"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <Layers className="w-4 h-4 text-[#141414]" />
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

        {/* Back to Home Button */}
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-full bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali</span>
            <span className="sm:hidden">Kembali</span>
          </button>
        )}
      </div>
    </header>
  );
};
