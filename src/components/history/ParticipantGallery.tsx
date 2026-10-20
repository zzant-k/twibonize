import React, { useState } from 'react';
import { Users, RefreshCw, Sparkles, X, Database } from 'lucide-react';
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
  const isConfigured = isSupabaseConfigured();

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
                {participants.length} Peserta
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Galeri riwayat foto peserta LKMM-D 2026 yang telah mengunduh twibbon.
          </p>
        </div>

        {isConfigured && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] transition-colors disabled:opacity-50"
            title="Muat ulang peserta terbaru"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
        )}
      </div>

      {/* Supabase Not Configured Notice */}
      {!isConfigured ? (
        <div className="p-6 rounded-2xl border border-dashed border-[#333333] bg-[#1a1a1a]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#222222] text-blue-400 border border-[#333333] flex items-center justify-center shrink-0 mt-0.5">
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
        <div className="py-12 px-6 rounded-2xl border border-[#262626] bg-[#161616] flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-gray-400 mb-3">
            <Users className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            Belum Ada Peserta yang Terdaftar
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            Jadilah yang pertama mengunduh twibbon LKMM-D 2026 dan nama Anda akan muncul di galeri ini!
          </p>
        </div>
      ) : (
        /* Participants Responsive Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {participants.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedParticipant(p)}
              className="group flex flex-col rounded-2xl bg-[#1a1a1a] border border-[#262626] hover:border-blue-500/60 hover:shadow-lg transition-all cursor-pointer overflow-hidden text-left"
            >
              {/* Thumbnail Container */}
              <div
                className="relative w-full aspect-square bg-[#121212] overflow-hidden border-b border-[#262626]"
                style={{
                  backgroundImage: 'radial-gradient(#333333 0.8px, transparent 0.8px)',
                  backgroundSize: '10px 10px',
                }}
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-200"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] bg-[#222222]/90 border border-[#333333] font-medium px-2 py-0.5 rounded-full shadow-sm text-white">
                    Lihat
                  </span>
                </div>
              </div>

              {/* Participant info */}
              <div className="p-2.5 flex flex-col justify-between">
                <span className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedParticipant(null)}
          />

          <div className="relative w-full max-w-sm bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2a2a2a] overflow-hidden z-10 p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{selectedParticipant.name}</span>
                </h3>
                <span className="text-[11px] text-gray-400">
                  LKMM-D 2026 • {formatDate(selectedParticipant.created_at)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-square rounded-xl bg-[#121212] border border-[#2a2a2a] overflow-hidden flex items-center justify-center p-1">
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
