import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  twibbonTitle: string;
  onBackToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ twibbonTitle, onBackToHome }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-apple-border/50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand Wordmark & Campaign Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-8 h-8 rounded-lg bg-apple-text hover:bg-black flex items-center justify-center text-white shadow-sm shrink-0 transition-colors focus:outline-none"
            title="Kembali ke Beranda"
          >
            <Layers className="w-4 h-4 text-white" />
          </button>

          <div className="flex flex-col min-w-0 text-left">
            <span className="font-semibold text-sm tracking-tight text-apple-text leading-tight shrink-0">
              Twibbon Studio
            </span>
            <span className="text-[11px] text-apple-secondary font-medium tracking-normal truncate">
              {twibbonTitle}
            </span>
          </div>
        </div>

        {/* Back to Home Button */}
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-apple-secondary hover:text-apple-text px-3 py-1.5 rounded-lg hover:bg-apple-surface transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali ke Profil Fauzan Yahya</span>
            <span className="sm:hidden">Kembali</span>
          </button>
        )}
      </div>
    </header>
  );
};
