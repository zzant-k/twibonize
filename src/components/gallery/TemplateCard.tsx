import React, { useState } from 'react';
import { ArrowRight, ImageOff } from 'lucide-react';
import { TwibbonTemplate } from '../../types/template';
import { Badge } from '../ui/Badge';

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
      className={`group relative flex flex-col rounded-apple-lg border transition-all duration-200 cursor-pointer overflow-hidden bg-white text-left ${
        isSelected
          ? 'border-apple-blue ring-2 ring-apple-blue/20 shadow-elevated'
          : 'border-apple-border/60 hover:border-apple-border hover:shadow-card active:scale-[0.99]'
      }`}
    >
      {/* Frame Visual Preview Area */}
      <div
        className={`relative w-full ${getAspectRatioStyle()} max-h-[360px] flex items-center justify-center p-4 bg-apple-surface/70 border-b border-apple-border/30 overflow-hidden`}
        style={{
          backgroundImage:
            'radial-gradient(#D2D2D7 0.75px, transparent 0.75px)',
          backgroundSize: '12px 12px',
        }}
      >
        {!imageError ? (
          <img
            src={previewSource}
            alt={template.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-[1.02] transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-apple-secondary text-xs p-4 text-center">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span>Frame gagal dimuat</span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-sm text-apple-text text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            Gunakan Template
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <Badge variant="blue">{template.category}</Badge>
            <Badge variant="neutral">
              {template.aspectRatio} • {template.outputWidth}×{template.outputHeight}
            </Badge>
          </div>

          <h3 className="text-base font-semibold text-apple-text tracking-tight group-hover:text-apple-blue transition-colors">
            {template.name}
          </h3>

          <p className="text-xs text-apple-secondary line-clamp-2 mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-apple-border/30 text-xs font-medium text-apple-blue">
          <span>Mulai sesuaikan</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
