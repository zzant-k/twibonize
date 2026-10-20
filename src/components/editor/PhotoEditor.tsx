import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  TwibbonTemplate,
  CaptionState,
  PhotoSource,
} from '../../types/template';
import { useImageLoader } from '../../hooks/useImageLoader';
import { usePhotoTransform } from '../../hooks/usePhotoTransform';
import { EditorCanvas } from './EditorCanvas';
import { EditorControls } from './EditorControls';
import { ExportModal } from './ExportModal';
import { generateTwibbonExport, triggerFileDownload, ExportResult } from '../../lib/imageExport';
import { copyCaptionToClipboard, openInstagram, shareTwibbon } from '../../lib/shareImage';
import { compressTwibbonThumbnail } from '../../lib/compressImage';
import { uploadParticipantTwibbon, isSupabaseConfigured } from '../../lib/supabase';

interface PhotoEditorProps {
  template: TwibbonTemplate;
  onParticipantAdded?: () => void;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  template,
  onParticipantAdded,
}) => {
  // Load Frame Image
  const { image: frameImage, isLoading: isFrameLoading, error: frameError } = useImageLoader(
    template.frameUrl
  );

  // Photo Source State
  const [photoSource, setPhotoSource] = useState<PhotoSource | null>(null);
  const activeObjectUrlRef = useRef<string | null>(null);

  // Photo Transforms
  const {
    transform,
    setScale,
    setOffsetX,
    setOffsetY,
    updateOffsetsByDelta,
    zoomIn,
    zoomOut,
    rotateClockwise,
    resetTransform,
  } = usePhotoTransform();

  // Caption State
  const [caption, setCaption] = useState<CaptionState>(() => ({
    enabled: !!template.allowCaption && !!template.defaultCaption,
    text: template.defaultCaption || '',
    align: template.captionConfig?.defaultAlign || 'center',
    fontSize: template.captionConfig?.defaultFontSize || 32,
    color: template.captionConfig?.defaultColor || '#FFFFFF',
  }));

  // Participant Name State for Supabase public gallery
  const [participantName, setParticipantName] = useState('');

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // UI feedback & error alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Cleanup object URL when photo changes or unmounts
  const cleanupPhotoUrl = useCallback(() => {
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupPhotoUrl();
    };
  }, [cleanupPhotoUrl]);


  // Handle User Photo Upload with Validation & Initial Positioning
  const handlePhotoUpload = useCallback(
    (file: File) => {
      setErrorMessage(null);

      // 1. Validasi Tipe File
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setErrorMessage(
          'Format file tidak didukung. Harap gunakan foto berformat JPG, PNG, atau WebP.'
        );
        return;
      }

      // 2. Validasi Ukuran File
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Batas maksimum adalah 15 MB.`
        );
        return;
      }

      cleanupPhotoUrl();

      const objectUrl = URL.createObjectURL(file);
      activeObjectUrlRef.current = objectUrl;

      const img = new Image();
      img.onload = () => {
        // Initial positioning: Cover mode centered
        setPhotoSource({
          file,
          url: objectUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          imageElement: img,
        });

        resetTransform();
      };

      img.onerror = () => {
        setErrorMessage(
          'Gagal membaca file gambar. Pastikan file tidak rusak dan coba lagi.'
        );
        cleanupPhotoUrl();
      };

      img.src = objectUrl;
    },
    [cleanupPhotoUrl, resetTransform]
  );

  const handleRemovePhoto = () => {
    cleanupPhotoUrl();
    setPhotoSource(null);
    resetTransform();
  };

  // Handle Export & Download
  const handleDownload = async () => {
    if (!photoSource) {
      setErrorMessage('Harap unggah foto Anda terlebih dahulu.');
      return;
    }

    if (!frameImage) {
      setErrorMessage('Frame belum selesai dimuat. Tunggu beberapa saat.');
      return;
    }

    try {
      setIsExporting(true);
      setErrorMessage(null);

      const result = await generateTwibbonExport({
        template,
        frameImage,
        photoImage: photoSource.imageElement,
        transform,
      });

      setExportResult(result);

      // Otomatis download file PNG resolusi penuh
      triggerFileDownload(result.objectUrl, result.filename);

      // Tampilkan modal hasil ekspor
      setIsExportModalOpen(true);

      // Kompresi di sisi browser (~35-50 KB WebP) dan upload ke Supabase jika terhubung
      if (isSupabaseConfigured()) {
        compressTwibbonThumbnail(result.canvas, 420, 0.75)
          .then(async (compressed) => {
            const res = await uploadParticipantTwibbon({
              name: participantName.trim() || undefined,
              compressedBlob: compressed.blob,
            });
            if (res.success) {
              onParticipantAdded?.();
            }
          })
          .catch((uploadErr) => {
            console.warn('Gagal menyimpan thumbnail peserta:', uploadErr);
          });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengekspor gambar twibbon.';
      setErrorMessage(msg);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Direct Share via Web Share API
  const handleShare = async () => {
    if (!photoSource || !frameImage) return;

    try {
      setIsExporting(true);
      const result = await generateTwibbonExport({
        template,
        frameImage,
        photoImage: photoSource.imageElement,
        transform,
      });

      setExportResult(result);
      setIsExporting(false);

      const shareResult = await shareTwibbon({
        file: result.file,
        title: `Twibbon ${template.name}`,
        text: caption.enabled ? caption.text : `Twibbon ${template.name}`,
      });

      if (!shareResult.success && !shareResult.cancelled) {
        // Jika share tidak didukung, buka modal ekspor untuk alternatif download
        setIsExportModalOpen(true);
      }
    } catch {
      setIsExporting(false);
      setIsExportModalOpen(true);
    }
  };

  const handleCopyCaption = async () => {
    if (!caption.text) return;
    const ok = await copyCaptionToClipboard(caption.text);
    if (ok) {
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Top Bar Header */}
      <div className="mb-6 pb-3 border-b border-[#262626]">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {template.name}
        </h1>
      </div>

      {/* Frame Error Alert */}
      {frameError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{frameError}</span>
        </div>
      )}

      {/* User Input Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-red-300 hover:text-white underline hover:no-underline font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Two-Column Layout (Desktop) / Vertical Stack (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Interactive Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full sticky top-20">
            <EditorCanvas
              template={template}
              frameImage={frameImage}
              photoSource={photoSource}
              transform={transform}
              onDeltaMove={updateOffsetsByDelta}
              onScaleChange={setScale}
              onUploadClick={() => {
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
              onDropFile={handlePhotoUpload}
              isFrameLoading={isFrameLoading}
            />
          </div>
        </div>

        {/* Right Column: Controls Panel */}
        <div className="lg:col-span-5">
          <EditorControls
            template={template}
            photoSource={photoSource}
            transform={transform}
            caption={caption}
            participantName={participantName}
            onParticipantNameChange={setParticipantName}
            onUploadFile={handlePhotoUpload}
            onRemovePhoto={handleRemovePhoto}
            onScaleChange={setScale}
            onOffsetXChange={setOffsetX}
            onOffsetYChange={setOffsetY}
            onZoomIn={() => zoomIn(0.1)}
            onZoomOut={() => zoomOut(0.1)}
            onRotateClockwise={rotateClockwise}
            onResetTransform={resetTransform}
            onChangeCaption={setCaption}
            onDownload={handleDownload}
            onShare={handleShare}
            onCopyCaption={handleCopyCaption}
            onOpenInstagram={openInstagram}
            isExporting={isExporting}
            copiedCaptionFeedback={copiedFeedback}
          />
        </div>
      </div>

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportResult={exportResult}
        captionText={caption.enabled ? caption.text : ''}
        templateName={template.name}
      />
    </div>
  );
};
