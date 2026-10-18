import React, { useRef } from 'react';
import {
  Upload,
  RefreshCw,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  User,
} from 'lucide-react';
import { TwibbonTemplate, PhotoTransform, CaptionState, PhotoSource } from '../../types/template';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { MIN_SCALE, MAX_SCALE } from '../../hooks/usePhotoTransform';

interface EditorControlsProps {
  template: TwibbonTemplate;
  photoSource: PhotoSource | null;
  transform: PhotoTransform;
  caption: CaptionState;
  participantName: string;
  onParticipantNameChange: (name: string) => void;
  onUploadFile: (file: File) => void;
  onRemovePhoto: () => void;
  onScaleChange: (newScale: number | ((prev: number) => number)) => void;
  onOffsetXChange: (x: number) => void;
  onOffsetYChange: (y: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateClockwise: () => void;
  onResetTransform: () => void;
  onChangeCaption: (updater: (prev: CaptionState) => CaptionState) => void;
  onDownload: () => void;
  onShare: () => void;
  onCopyCaption: () => void;
  onOpenInstagram: () => void;
  isExporting: boolean;
  copiedCaptionFeedback: boolean;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  template,
  photoSource,
  transform,
  caption,
  participantName,
  onParticipantNameChange,
  onUploadFile,
  onRemovePhoto,
  onScaleChange,
  onOffsetXChange,
  onOffsetYChange,
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onResetTransform,
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

  // Range slider posisi logis (sebanding dengan dimensi output template)
  const maxRangeX = Math.round(template.outputWidth * 0.75);
  const maxRangeY = Math.round(template.outputHeight * 0.75);

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
      <div className="flex flex-col gap-3 p-4 rounded-apple-lg bg-white border border-apple-border/60 shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-apple-text uppercase tracking-wider">
            Sumber Foto
          </span>
          {photoSource && (
            <span className="text-[11px] text-apple-secondary font-mono">
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

      {/* 2. Kontrol Posisi & Transformasi (hanya aktif jika foto ada) */}
      <div
        className={`flex flex-col gap-4 p-4 rounded-apple-lg bg-white border border-apple-border/60 shadow-subtle transition-opacity ${
          !photoSource ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-apple-blue" />
            <span className="text-xs font-semibold text-apple-text uppercase tracking-wider">
              Atur Posisi &amp; Ukuran
            </span>
          </div>

          <button
            type="button"
            onClick={onResetTransform}
            className="flex items-center gap-1 text-[11px] font-medium text-apple-secondary hover:text-apple-blue transition-colors px-2 py-1 rounded hover:bg-apple-surface"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Zoom Slider + Quick Buttons */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onZoomOut}
              className="w-8 h-8 rounded-full border border-apple-border flex items-center justify-center text-apple-secondary hover:text-apple-text hover:bg-apple-surface transition-colors shrink-0"
              title="Perkecil (-10%)"
              aria-label="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1">
              <Slider
                label="Perbesar / Perkecil"
                value={transform.scale}
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={0.05}
                displayValue={`${Math.round(transform.scale * 100)}%`}
                onChange={onScaleChange}
              />
            </div>

            <button
              type="button"
              onClick={onZoomIn}
              className="w-8 h-8 rounded-full border border-apple-border flex items-center justify-center text-apple-secondary hover:text-apple-text hover:bg-apple-surface transition-colors shrink-0"
              title="Perbesar (+10%)"
              aria-label="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Offset Slider */}
        <Slider
          label="Posisi Horizontal (X)"
          value={transform.offsetX}
          min={-maxRangeX}
          max={maxRangeX}
          step={2}
          unit=" px"
          onChange={onOffsetXChange}
          onReset={() => onOffsetXChange(0)}
        />

        {/* Vertical Offset Slider */}
        <Slider
          label="Posisi Vertikal (Y)"
          value={transform.offsetY}
          min={-maxRangeY}
          max={maxRangeY}
          step={2}
          unit=" px"
          onChange={onOffsetYChange}
          onReset={() => onOffsetYChange(0)}
        />

        {/* Quick Rotation */}
        <div className="flex items-center justify-between pt-1 border-t border-apple-border/30">
          <span className="text-xs text-apple-secondary font-medium">Putar Foto</span>
          <button
            type="button"
            onClick={onRotateClockwise}
            className="inline-flex items-center gap-1.5 text-xs text-apple-text font-medium px-3 py-1.5 rounded-apple bg-apple-surface hover:bg-apple-surfaceHover border border-apple-border/50 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-apple-blue" />
            <span>90° Searah Jarum Jam</span>
          </button>
        </div>
      </div>

      {/* 3. Panel Caption Media Sosial (Siap Salin) */}
      {caption.text && (
        <div className="flex flex-col gap-2.5 p-4 rounded-apple-lg bg-white border border-apple-border/60 shadow-subtle text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-apple-text uppercase tracking-wider flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-apple-blue" />
              Caption Media Sosial
            </span>
            <button
              type="button"
              onClick={onCopyCaption}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                copiedCaptionFeedback
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-apple-surface hover:bg-apple-surfaceHover text-apple-blue border border-apple-border/50'
              }`}
            >
              {copiedCaptionFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={3}
            value={caption.text}
            onChange={(e) => {
              const newText = e.target.value;
              onChangeCaption((prev) => ({ ...prev, text: newText }));
            }}
            className="w-full px-3 py-2 text-xs rounded-apple bg-apple-surface/60 border border-apple-border/60 text-apple-text font-sans focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:bg-white transition-all resize-none leading-relaxed"
          />
        </div>
      )}

      {/* 4. Aksi Utama: Unduh, Salin & Bagikan */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Input Nama Peserta untuk Galeri Riwayat */}
        <div className="flex flex-col gap-1.5 p-3 rounded-apple bg-apple-surface/60 border border-apple-border/50 text-left">
          <label htmlFor="participant-name-input" className="text-xs font-semibold text-apple-text flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-apple-blue" />
              Nama Peserta
            </span>
            <span className="text-[10px] text-apple-secondary font-normal">Opsional • Masuk Galeri</span>
          </label>
          <input
            id="participant-name-input"
            type="text"
            placeholder="Masukkan nama Anda (misal: Budi Santoso)"
            value={participantName}
            onChange={(e) => onParticipantNameChange(e.target.value)}
            maxLength={40}
            className="w-full px-3 py-2 text-xs rounded-apple bg-white border border-apple-border/60 text-apple-text placeholder:text-apple-secondary/60 focus:outline-none focus:ring-2 focus:ring-apple-blue/40 transition-all"
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!photoSource}
          isLoading={isExporting}
          onClick={onDownload}
          leftIcon={<Download className="w-5 h-5" />}
        >
          {isExporting ? 'Memproses Gambar...' : 'Unduh Gambar (Resolusi Penuh)'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onCopyCaption}
            leftIcon={
              copiedCaptionFeedback ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-apple-blue" />
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
            leftIcon={<Share2 className="w-4 h-4 text-apple-blue" />}
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
