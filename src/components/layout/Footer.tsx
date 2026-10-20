import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#242424] bg-[#141414] py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <span className="font-semibold text-white">
          Twibbon Studio
        </span>

        <p className="text-[11px] text-gray-500">
          Pengolahan foto dilakukan 100% lokal di browser tanpa server.
        </p>
      </div>
    </footer>
  );
};
