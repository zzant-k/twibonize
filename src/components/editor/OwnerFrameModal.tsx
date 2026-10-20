import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { TwibbonTemplate } from '../../types/template';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface OwnerFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TwibbonTemplate;
  onSaveFrame: (data: {
    name: string;
    frameBlob?: Blob;
    frameUrl: string;
    aspectRatio: string;
    outputWidth: number;
    outputHeight: number;
    defaultCaption: string;
    allowCaption: boolean;
  }) => void;
  onResetToDefault: () => void;
  isCustomFrameActive: boolean;
}

const RATIO_OPTIONS = [
  { label: '1:1 (Kotak Feed)', ratio: '1:1', width: 1080, height: 1080 },
  { label: '4:5 (Potret Instagram)', ratio: '4:5', width: 1080, height: 1350 },
  { label: '9:16 (Story / Reels / WA)', ratio: '9:16', width: 1080, height: 1920 },
];

export const OwnerFrameModal: React.FC<OwnerFrameModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSaveFrame,
  onResetToDefault,
  isCustomFrameActive,
}) => {
  const [name, setName] = useState(currentTemplate.name);
  const [aspectRatio, setAspectRatio] = useState(currentTemplate.aspectRatio);
  const [defaultCaption, setDefaultCaption] = useState(currentTemplate.defaultCaption || '');
  const [allowCaption, setAllowCaption] = useState(currentTemplate.allowCaption);
  const [frameBlob, setFrameBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentTemplate.frameUrl);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedRatioConfig =
    RATIO_OPTIONS.find((r) => r.ratio === aspectRatio) || RATIO_OPTIONS[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file.type !== 'image/png') {
      setErrorMsg('Harap pilih file berformat PNG dengan latar transparan.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Ukuran file frame maksimal 20 MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFrameBlob(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('Harap isi judul twibbon.');
      return;
    }

    onSaveFrame({
      name: name.trim(),
      frameBlob: frameBlob || undefined,
      frameUrl: previewUrl,
      aspectRatio,
      outputWidth: selectedRatioConfig.width,
      outputHeight: selectedRatioConfig.height,
      defaultCaption,
      allowCaption,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Frame (Mode Pemilik)"
      description="Unggah frame utama dan atur twibbon yang akan langsung digunakan oleh pengunjung."
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4 pt-1 text-left">
        {/* Hidden File Picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Frame Uploader Area */}
        <div>
          <label className="text-xs font-semibold text-white block mb-1.5">
            File Frame PNG Transparan
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-[#333333] hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#141414] hover:bg-[#181818] transition-all text-center"
            style={{
              backgroundImage: 'radial-gradient(#333333 0.8px, transparent 0.8px)',
              backgroundSize: '12px 12px',
            }}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={previewUrl}
                  alt="Frame Preview"
                  className="max-h-[140px] w-auto object-contain filter drop-shadow-sm rounded group-hover:scale-105 transition-transform"
                />
                <span className="text-[11px] text-blue-400 font-medium inline-flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Klik untuk mengganti frame PNG
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <div className="w-10 h-10 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-gray-400 mb-2 group-hover:text-blue-400 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Pilih file PNG Transparan
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  Mendukung PNG hingga 20 MB
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Judul Twibbon */}
        <div>
          <label className="text-xs font-semibold text-white block mb-1">
            Judul Twibbon / Nama Event
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Graduation Class of 2026 / HUT RI ke-81"
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#222222] border border-[#333333] text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500 transition-all"
          />
        </div>

        {/* 3. Rasio Aspek */}
        <div>
          <label className="text-xs font-semibold text-white block mb-1.5">
            Rasio Aspek &amp; Ukuran Ekspor
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RATIO_OPTIONS.map((opt) => {
              const isSelected = aspectRatio === opt.ratio;
              return (
                <button
                  key={opt.ratio}
                  type="button"
                  onClick={() => setAspectRatio(opt.ratio)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-[#2a2a2a] bg-[#222222] hover:bg-[#282828] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt.ratio}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">
                    {opt.width}×{opt.height}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Caption Media Sosial Bawaan */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-white">
              Caption Media Sosial (Untuk Disalin Pengunjung)
            </label>
            <label className="text-[11px] text-gray-400 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowCaption}
                onChange={(e) => setAllowCaption(e.target.checked)}
                className="rounded bg-[#222222] border-[#333333] text-blue-600 focus:ring-blue-500"
              />
              <span>Sediakan Caption</span>
            </label>
          </div>
          <p className="text-[11px] text-gray-400 mb-1.5">
            Teks ini disediakan agar pengunjung dapat menyalinnya untuk postingan Instagram / medsos mereka (tidak dicetak di atas frame gambar).
          </p>
          <textarea
            rows={2}
            value={defaultCaption}
            onChange={(e) => setDefaultCaption(e.target.value)}
            placeholder="Tuliskan ucapan, ajakan, atau hashtag yang dapat langsung disalin..."
            disabled={!allowCaption}
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#222222] border border-[#333333] text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500 transition-all disabled:opacity-40 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#262626] gap-2">
          {isCustomFrameActive && (
            <button
              type="button"
              onClick={() => {
                onResetToDefault();
                onClose();
              }}
              className="text-xs text-gray-400 hover:text-red-400 font-medium transition-colors"
            >
              Reset ke Frame Bawaan
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="md" onClick={onClose}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Terapkan Frame Ini
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
