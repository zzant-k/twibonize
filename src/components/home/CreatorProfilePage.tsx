import React, { useState } from 'react';
import {
  User,
  Share2,
  Users,
  Megaphone,
  Calendar,
  Bookmark,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Check,
} from 'lucide-react';
import { TwibbonTemplate } from '../../types/template';

interface CreatorProfilePageProps {
  template: TwibbonTemplate;
  onSelectTemplate: (template: TwibbonTemplate) => void;
  participantCount?: number;
}

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({
  template,
  onSelectTemplate,
  participantCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'campaign' | 'collections' | 'posts'>('campaign');
  const [copiedShare, setCopiedShare] = useState(false);

  // Total supporters: base 125 + realtime Supabase participants
  const totalSupporters = 0 + participantCount;

  const handleShareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fauzan Yahya — Twibbonize Creator Profile',
          text: 'Lihat twibbon resmi LKMM-D 2026 buatan Fauzan Yahya (@zannfeast) di Twibbonize!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="min-h-screen bg-[#141517] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <main className="flex-1 w-full">
        {/* Banner Area with Subtle Twibbonize Doodle Pattern (Compact 20% reduced height) */}
        <div className="relative w-full h-36 sm:h-44 bg-gradient-to-r from-[#181818] via-[#202020] to-[#181818] overflow-hidden border-b border-[#262626]">
          {/* Subtle SVG Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141517] via-transparent to-transparent opacity-80" />
        </div>

        {/* Profile Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16">
          {/* Creator Header: Avatar, Info & Stats */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-4">
            {/* Left: Avatar & Creator Identity (Always Side-by-Side) */}
            <div className="flex flex-row items-center sm:items-end gap-4 sm:gap-5">
              {/* Creator Avatar */}
              <div className="relative shrink-0 z-20">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#222427] border-4 border-[#141517] flex items-center justify-center text-gray-400 shadow-xl overflow-hidden">
                  <User className="w-10 h-10 sm:w-14 sm:h-14 stroke-[1.5]" />
                </div>
              </div>

              {/* Creator Names & Share Button Sejajar di Sampingnya */}
              <div className="relative z-20 flex flex-row items-center gap-3 sm:gap-4 text-left">
                {/* Text Block: Nama di Atas, Username di Bawah */}
                <div className="flex flex-col text-left">
                  <h1
                    className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight"
                    style={{ color: '#ffffff', opacity: 1 }}
                  >
                    Fauzan Yahya
                  </h1>
                  <span
                    className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5"
                    style={{ color: '#9ca3af', opacity: 1 }}
                  >
                    @zannfeast
                  </span>
                </div>

                {/* Share Button (Continuous Pill Obsidian Dark Glass) */}
                <button
                  type="button"
                  onClick={handleShareProfile}
                  className={`btn-pill ${
                    copiedShare ? 'btn-pill-emerald' : 'btn-pill-secondary'
                  } w-9 h-9 min-h-[36px] p-0 rounded-full shrink-0`}
                  title={copiedShare ? 'Tautan disalin!' : 'Bagikan Profil'}
                  aria-label="Bagikan Profil"
                >
                  <span className="pill-specular" aria-hidden="true" />
                  <span className="btn-label">
                    {copiedShare ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Stats Card (Obsidian Dark Glass Card) */}
            <div className="obsidian-card w-full sm:w-auto p-4 sm:p-5 flex flex-col gap-3 min-w-[280px] text-left">
              {/* Supporters */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 text-gray-300 font-medium">
                  <Users className="w-4 h-4 text-gray-400" />
                  Supporters
                </span>
                <span className="font-semibold text-white text-sm">
                  {totalSupporters.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Campaigns */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 text-gray-300 font-medium">
                  <Megaphone className="w-4 h-4 text-gray-400" />
                  Campaigns
                </span>
                <span className="font-semibold text-white text-sm">
                  1
                </span>
              </div>

              {/* Joined Since */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 text-gray-300 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Joined Since
                </span>
                <span className="font-semibold text-white text-xs">
                  08 Aug 2026
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="border-b border-white/[0.08] flex items-center justify-between gap-4 mt-2">
            {/* Left Tabs */}
            <div className="flex items-center gap-3 py-2 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('campaign')}
                className={`btn-pill px-4 py-1.5 text-xs font-semibold ${
                  activeTab === 'campaign'
                    ? 'btn-pill-primary text-white'
                    : 'btn-pill-ghost text-gray-400 hover:text-white'
                }`}
              >
                <span className="pill-specular" aria-hidden="true" />
                <span className="btn-label gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Campaign</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full font-mono">
                    1
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('collections')}
                className={`btn-pill px-4 py-1.5 text-xs font-medium ${
                  activeTab === 'collections'
                    ? 'btn-pill-primary text-white'
                    : 'btn-pill-ghost text-gray-400 hover:text-white'
                }`}
              >
                <span className="pill-specular" aria-hidden="true" />
                <span className="btn-label gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Collections</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className={`btn-pill px-4 py-1.5 text-xs font-medium ${
                  activeTab === 'posts'
                    ? 'btn-pill-primary text-white'
                    : 'btn-pill-ghost text-gray-400 hover:text-white'
                }`}
              >
                <span className="pill-specular" aria-hidden="true" />
                <span className="btn-label gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Posts</span>
                </span>
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-pill btn-pill-secondary w-9 h-9 min-h-[36px] p-0 rounded-full"
                aria-label="Cari Campaign"
              >
                <span className="pill-specular" aria-hidden="true" />
                <span className="btn-label">
                  <Search className="w-3.5 h-3.5" />
                </span>
              </button>

              <button
                type="button"
                className="btn-pill btn-pill-secondary w-9 h-9 min-h-[36px] p-0 rounded-full"
                aria-label="Filter"
              >
                <span className="pill-specular" aria-hidden="true" />
                <span className="btn-label">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content: Campaign Cards */}
          <div className="py-5 sm:py-6">
            {activeTab === 'campaign' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Main Campaign Card: The configured LKMM-D Pokédex Frame (Obsidian Dark Glass Card) */}
                <div
                  onClick={() => onSelectTemplate(template)}
                  className="obsidian-card group flex flex-col cursor-pointer transition-all duration-240 hover:-translate-y-1 text-left"
                >
                  {/* Twibbon Frame Preview Box (Obsidian Well) */}
                  <div
                    className="relative w-full aspect-square bg-[#101113] overflow-hidden flex items-center justify-center p-3 border-b border-white/[0.06]"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
                      backgroundSize: '12px 12px',
                    }}
                  >
                    {/* The Frame Image */}
                    <img
                      src={template.frameUrl}
                      alt={template.name}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Interactive Hover Overlay with Call-to-Action (Continuous Pill) */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <span className="btn-pill btn-pill-primary px-5 py-2.5 text-xs font-semibold shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <span className="pill-specular" aria-hidden="true" />
                        <span className="btn-label gap-2">
                          <span>Gunakan Frame Ini</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Campaign Card Details */}
                  <div className="p-4 flex flex-col justify-between flex-grow gap-3">
                    <div>
                      <h3 className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Card Footer: Creator info & Supporter Count */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-[11px] text-gray-400">
                      <span className="font-medium text-gray-300">
                        Oleh Fauzan Yahya
                      </span>
                      <span className="font-mono text-gray-400">
                        {totalSupporters} Supporters
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state for Collections / Posts */
              <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center text-gray-500 mb-3">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-300">
                  Belum ada item di tab ini
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  Silakan periksa tab Campaign untuk menggunakan template twibbon yang tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
