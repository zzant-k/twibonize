import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { TwibbonTemplate } from '../../types/template';
import { TemplateCard } from './TemplateCard';
import { Button } from '../ui/Button';

interface TemplateGalleryProps {
  templates: TwibbonTemplate[];
  selectedTemplate: TwibbonTemplate | null;
  onSelectTemplate: (template: TwibbonTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Daftar kategori unik
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => set.add(t.category));
    return ['Semua', ...Array.from(set)];
  }, [templates]);

  // Filter template berdasarkan pencarian dan kategori
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory =
        selectedCategory === 'Semua' || template.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        template.name.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
  };

  return (
    <section id="template-gallery" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-apple-text">
            Koleksi Frame Twibbon
          </h2>
          <p className="text-sm text-apple-secondary mt-1">
            Pilih desain frame di bawah ini untuk memulai menambahkan foto Anda.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-apple-secondary">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari frame atau momen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-apple bg-apple-surface border border-apple-border/60 text-sm text-apple-text placeholder-apple-secondary/70 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-apple-secondary hover:text-apple-text"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-apple-text text-white shadow-sm'
                    : 'bg-apple-surface text-apple-secondary hover:text-apple-text hover:bg-apple-surfaceHover border border-apple-border/40'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-apple-surface/40 rounded-apple-lg border border-apple-border/40">
          <div className="w-12 h-12 rounded-full bg-apple-surface flex items-center justify-center text-apple-secondary mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-apple-text">
            Tidak ada frame yang cocok
          </h3>
          <p className="text-xs text-apple-secondary mt-1 max-w-sm mb-4">
            Tidak ditemukan template dengan kata kunci &quot;{searchQuery}&quot; pada kategori &quot;{selectedCategory}&quot;.
          </p>
          <Button variant="secondary" size="sm" onClick={handleResetFilters}>
            Reset Pencarian
          </Button>
        </div>
      )}
    </section>
  );
};
