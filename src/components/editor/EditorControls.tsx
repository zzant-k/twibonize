import React, { useRef } from 'react';
import {
  Upload,
  Trash2,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  User,
} from 'lucide-react';
import { TwibbonTemplate, CaptionState, PhotoSource } from '../../types/template';
import { Button } from '../ui/Button';

interface EditorControlsProps {
  template: TwibbonTemplate;
  photoSource: PhotoSource | null;
  caption: CaptionState;
  participantName: string;
  onParticipantNameChange: (name: string) => void;
  onUploadFile: (file: File) => void;
  onRemovePhoto: () => void;
  onChangeCaption: (updater: (prev: CaptionState) => CaptionState) => void;
  onDownload: () => void;
  onShare: () => void;
  onCopyCaption: () => void;
  onOpenInstagram: () => void;
  isExporting: boolean;
  copiedCaptionFeedback: boolean;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  photoSource,
  caption,
  participantName,
  onParticipantNameChange,
  onUploadFile,
  onRemovePhoto,
  onChangeCaption,
  onDownload,
  onShare,
  onCopyCaption,
  onOpenInstagram,
  isExporting,
  copiedCaptionFeedback,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFile(e.target.files[0]);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Hidden File Picker Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. Pengelolaan Foto */}
      <div className="obsidian-card flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          {photoSource && (
            <span className="obsidian-badge text-[11px] text-gray-300 font-mono font-medium px-2.5 py-0.5">
              {photoSource.width} × {photoSource.height} px
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={photoSource ? 'secondary' : 'primary'}
            size="md"
            fullWidth
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {photoSource ? 'Ganti Foto' : 'Unggah Foto'}
          </Button>

          {photoSource && (
            <Button
              variant="danger"
              size="md"
              onClick={onRemovePhoto}
              title="Hapus foto saat ini"
              aria-label="Hapus foto"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Input Nama Peserta (Wajib Diisi) */}
      <div className="obsidian-card flex flex-col gap-2 p-3.5 text-left">
        <label
          htmlFor="participant-name-input"
          className="text-xs font-semibold text-white flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-white" />
            Nama Peserta
          </span>
          <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Wajib Diisi
          </span>
        </label>
        <input
          id="participant-name-input"
          type="text"
          placeholder="Masukkan nama Anda (misal: Budi Santoso)"
          value={participantName}
          onChange={(e) => onParticipantNameChange(e.target.value)}
          maxLength={40}
          required
          className={`obsidian-input w-full px-3.5 py-2.5 text-xs rounded-xl text-white placeholder:text-gray-500 focus:outline-none transition-all ${
            !participantName.trim() && photoSource
              ? 'border-blue-500/40 ring-1 ring-blue-500/20'
              : ''
          }`}
        />
        <p className="text-[11px] text-gray-400 leading-snug">
          Nama ini akan otomatis menggantikan bagian <strong>[Nama Panggilan]</strong> pada caption di bawah dan dicatat di galeri peserta.
        </p>
      </div>

      {/* 3. Panel Caption Media Sosial (Siap Salin & Terupdate Otomatis) */}
      {caption.text && (
        <div className="obsidian-card flex flex-col gap-2.5 p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-white" />
              Caption Media Sosial
            </span>
            <button
              type="button"
              onClick={onCopyCaption}
              className={`btn-pill ${
                copiedCaptionFeedback ? 'btn-pill-emerald' : 'btn-pill-secondary'
              } h-7 px-3 text-xs font-semibold gap-1.5`}
              title="Salin caption ke clipboard"
            >
              <span className="pill-specular" aria-hidden="true" />
              <span className="btn-label gap-1.5">
                {copiedCaptionFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span>Salin Teks</span>
                  </>
                )}
              </span>
            </button>
          </div>

          <textarea
            rows={4}
            value={caption.text}
            onChange={(e) => {
              const newText = e.target.value;
              onChangeCaption((prev) => ({ ...prev, text: newText }));
            }}
            className="obsidian-input w-full px-3.5 py-2.5 text-xs rounded-xl text-white placeholder:text-gray-500 font-sans focus:outline-none transition-all resize-none leading-relaxed"
          />
        </div>
      )}

      {/* 4. Aksi Utama: Unduh, Salin & Bagikan */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!photoSource || !participantName.trim()}
          isLoading={isExporting}
          onClick={onDownload}
          leftIcon={<Download className="w-5 h-5" />}
        >
          {isExporting ? 'Memproses Gambar...' : 'Unduh Gambar (Resolusi Penuh)'}
        </Button>

        {photoSource && !participantName.trim() && (
          <p className="text-[11px] text-amber-300/90 text-center -mt-1 font-medium">
            * Silakan isi nama peserta di atas untuk mengunduh
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onCopyCaption}
            leftIcon={
              copiedCaptionFeedback ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-blue-400" />
              )
            }
          >
            {copiedCaptionFeedback ? 'Caption Tersalin!' : 'Salin Caption'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            disabled={!photoSource || isExporting}
            onClick={onShare}
            leftIcon={<Share2 className="w-4 h-4 text-blue-400" />}
          >
            Bagikan
          </Button>
        </div>

        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={onOpenInstagram}
          leftIcon={<ExternalLink className="w-4 h-4" />}
        >
          Buka Instagram
        </Button>
      </div>
    </div>
  );
};
