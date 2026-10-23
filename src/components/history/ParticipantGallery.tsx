import React, { useState } from 'react';
import { Users, RefreshCw, Sparkles, X, Database, Search } from 'lucide-react';
import { Participant, isSupabaseConfigured } from '../../lib/supabase';

interface ParticipantGalleryProps {
  participants: Participant[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ParticipantGallery: React.FC<ParticipantGalleryProps> = ({
  participants,
  isLoading,
  onRefresh,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isConfigured = isSupabaseConfigured();

  const filteredParticipants = searchQuery.trim()
    ? participants.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : participants;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 mt-8 border-t border-[#262626] text-left">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Peserta yang Telah Bergabung
            </h2>
            {participants.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-gray-300 border border-[#2e2e2e]">
                {searchQuery.trim()
                  ? `${filteredParticipants.length} dari ${participants.length} Peserta`
                  : `${participants.length} Peserta`}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Galeri riwayat foto peserta LKMM-D 2026 yang telah mengunduh twibbon.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-stretch sm:self-auto">
          {participants.length > 6 && (
            <div className="relative min-w-[200px] sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama peserta..."
                className="w-full h-8 pl-8 pr-7 text-xs bg-white/[0.04] border border-white/[0.08] rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5"
                  title="Hapus pencarian"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {isConfigured && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="self-start sm:self-auto btn-pill btn-pill-secondary h-8 px-3.5 text-xs font-medium gap-1.5 min-h-[32px] shrink-0"
              title="Muat ulang peserta terbaru"
            >
              <span className="pill-specular" aria-hidden="true" />
              <span className="btn-label gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Perbarui</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Supabase Not Configured Notice */}
      {!isConfigured ? (
        <div className="obsidian-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] text-white border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Integrasi Supabase Siap Digunakan
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 max-w-xl leading-relaxed">
                Fitur kompresi otomatis (30-50 KB per foto) dan penyimpanan riwayat peserta sudah aktif.
                Cukup tambahkan <strong>VITE_SUPABASE_URL</strong> dan <strong>VITE_SUPABASE_ANON_KEY</strong> ke file <code>.env</code> Anda untuk langsung menghubungkannya.
              </p>
            </div>
          </div>
        </div>
      ) : participants.length === 0 ? (
        /* Empty State */
        <div className="obsidian-card py-12 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 mb-3">
            <Users className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            Belum Ada Peserta yang Terdaftar
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            Jadilah yang pertama mengunduh twibbon LKMM-D 2026 dan nama Anda akan muncul di galeri ini!
          </p>
        </div>
      ) : filteredParticipants.length === 0 ? (
        /* Filter Empty State */
        <div className="obsidian-card py-10 px-6 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-gray-400">
            Tidak ditemukan peserta dengan nama &ldquo;<span className="text-white font-medium">{searchQuery}</span>&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
          >
            Hapus filter pencarian
          </button>
        </div>
      ) : (
        /* Participants Responsive Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredParticipants.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedParticipant(p)}
              className="obsidian-card group flex flex-col transition-all duration-240 cursor-pointer overflow-hidden text-left hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div
                className="relative w-full aspect-square bg-[#101113] overflow-hidden border-b border-white/[0.06]"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 0.8px, transparent 0.8px)',
                  backgroundSize: '10px 10px',
                }}
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-200"
                />

                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="btn-pill btn-pill-secondary text-[10px] px-2.5 py-0.5 min-h-[24px]">
                    <span className="pill-specular" aria-hidden="true" />
                    <span className="btn-label">Lihat</span>
                  </span>
                </div>
              </div>

              {/* Participant info */}
              <div className="p-2.5 flex flex-col justify-between">
                <span className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                  {p.name}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {formatDate(p.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal: View Participant Twibbon */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedParticipant(null)}
          />

          <div className="obsidian-card relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden z-10 p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>{selectedParticipant.name}</span>
                </h3>
                <span className="text-[11px] text-gray-400">
                  LKMM-D 2026 • {formatDate(selectedParticipant.created_at)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="btn-pill btn-pill-secondary w-7 h-7 min-h-[28px] p-0 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
                aria-label="Tutup"
              >
                <span className="pill-specular" aria-hidden="true" />
                <span className="btn-label">
                  <X className="w-4 h-4" />
                </span>
              </button>
            </div>

            <div className="relative w-full aspect-square rounded-xl bg-[#101113] border border-white/[0.08] overflow-hidden flex items-center justify-center p-1">
              <img
                src={selectedParticipant.image_url}
                alt={selectedParticipant.name}
                className="w-full h-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
