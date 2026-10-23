import React, { useState } from 'react';
import { ArrowRight, ImageOff } from 'lucide-react';
import { TwibbonTemplate } from '../../types/template';

interface TemplateCardProps {
  template: TwibbonTemplate;
  isSelected?: boolean;
  onSelect: (template: TwibbonTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected = false,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);
  const previewSource = template.previewUrl || template.frameUrl;

  // Aspect ratio helper for the card preview container
  const getAspectRatioStyle = () => {
    switch (template.aspectRatio) {
      case '4:5':
        return 'aspect-[4/5]';
      case '9:16':
        return 'aspect-[9/16]';
      case '16:9':
        return 'aspect-[16/9]';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div
      onClick={() => onSelect(template)}
      className={`obsidian-card group relative flex flex-col transition-all duration-240 cursor-pointer overflow-hidden text-left ${
        isSelected
          ? 'border-white/40 ring-2 ring-white/20'
          : 'hover:-translate-y-1'
      }`}
    >
      {/* Frame Visual Preview Area (Obsidian Well) */}
      <div
        className={`relative w-full ${getAspectRatioStyle()} max-h-[360px] flex items-center justify-center p-4 bg-[#101113] border-b border-white/[0.06] overflow-hidden`}
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {!imageError ? (
          <img
            src={previewSource}
            alt={template.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 text-xs p-4 text-center">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span>Frame gagal dimuat</span>
          </div>
        )}

        {/* Hover overlay hint (Continuous Pill Obsidian Glass Button) */}
        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none p-4">
          <span className="btn-pill btn-pill-primary px-5 py-2.5 text-xs font-semibold shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <span className="pill-specular" aria-hidden="true" />
            <span className="btn-label">Gunakan Template</span>
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="obsidian-badge px-2.5 py-0.5 text-[11px] font-medium text-blue-300">
              {template.category}
            </span>
            <span className="obsidian-badge px-2.5 py-0.5 text-[11px] font-mono text-gray-400">
              {template.aspectRatio} • {template.outputWidth}×{template.outputHeight}
            </span>
          </div>

          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-300 transition-colors">
            {template.name}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
          <span>Mulai sesuaikan</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
        </div>
      </div>
    </div>
  );
};

