import React from 'react';
import { Search, Bell, User, Plus } from 'lucide-react';

interface TwibbonizeNavbarProps {
  onGoHome?: () => void;
  onStartCampaign?: () => void;
}

export const TwibbonizeNavbar: React.FC<TwibbonizeNavbarProps> = ({
  onGoHome,
  onStartCampaign,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#141414] border-b border-[#242424] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Twibbonize Brand Logo & Links */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 text-left group focus:outline-none"
            aria-label="Kembali ke Beranda"
          >
            {/* Twibbonize distinctive square logo glyph */}
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-1 shrink-0 group-hover:opacity-90 transition-opacity">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#141414]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-gray-200 transition-colors">
              twibbonize
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-gray-300">
            <button
              type="button"
              onClick={onGoHome}
              className="hover:text-white transition-colors"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="hover:text-white transition-colors"
            >
              For Creators
            </button>
          </nav>
        </div>

        {/* Center: Search Bar (Pill Shape) */}
        <div className="flex-1 max-w-md hidden sm:flex items-center justify-center">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-9 pl-4 pr-10 rounded-full bg-[#222222] border border-[#333333] text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-all"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Right: Notification, Start Campaign, Avatar */}
        <div className="flex items-center gap-3">
          {/* Notification Bell with red dot */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] flex items-center justify-center text-gray-300 hover:text-white relative transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FF3B30] border-2 border-[#141414]" />
          </button>

          {/* Start a Campaign Button */}
          <button
            type="button"
            onClick={onStartCampaign}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-[#141414] font-semibold text-xs tracking-tight shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Start a Campaign</span>
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onGoHome}
            className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#333333] border border-[#3a3a3a] flex items-center justify-center text-gray-300 transition-colors"
            aria-label="Profil Pengguna"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
