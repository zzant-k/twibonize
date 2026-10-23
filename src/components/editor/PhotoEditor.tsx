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
    updateOffsetsByDelta,
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

  // UI feedback & error alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Deteksi placeholder nama awal pada template caption (misal [Nama Panggilan] atau {nama panggilan})
  const initialPlaceholderMatch = template.defaultCaption?.match(
    /\[nama panggilan\]|\{nama panggilan\}|\[nama\]|\{nama\}/i
  );
  const nameTokenRef = useRef<string>(
    initialPlaceholderMatch ? initialPlaceholderMatch[0] : '[Nama Panggilan]'
  );

  // Update nama peserta dan sinkronkan otomatis ke dalam teks caption
  const handleParticipantNameChange = useCallback((newName: string) => {
    setParticipantName(newName);
    setErrorMessage(null);

    const targetName = newName.trim() || '[Nama Panggilan]';
    const currentToken = nameTokenRef.current;

    setCaption((prev) => {
      const currentText = prev.text;
      let nextText = currentText;

      // 1. Cari token nama sebelumnya di dalam caption
      const tokenIdx = currentText.indexOf(currentToken);
      if (tokenIdx !== -1) {
        nextText =
          currentText.slice(0, tokenIdx) +
          targetName +
          currentText.slice(tokenIdx + currentToken.length);
        nameTokenRef.current = targetName;
      } else {
        // 2. Jika tidak ditemukan, cari dengan regex placeholder
        const match = currentText.match(
          /\[nama panggilan\]|\{nama panggilan\}|\[nama\]|\{nama\}/i
        );
        if (match && typeof match.index === 'number') {
          const idx = match.index;
          nextText =
            currentText.slice(0, idx) +
            targetName +
            currentText.slice(idx + match[0].length);
          nameTokenRef.current = targetName;
        }
      }

      return {
        ...prev,
        text: nextText,
      };
    });
  }, []);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
    [cleanupPhotoUrl, resetTransform, setErrorMessage]
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

    if (!participantName.trim()) {
      setErrorMessage('Harap isi nama peserta terlebih dahulu sebelum mengunduh.');
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

    if (!participantName.trim()) {
      setErrorMessage('Harap isi nama peserta terlebih dahulu sebelum membagikan.');
      return;
    }

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
        text: caption.text || `Twibbon ${template.name}`,
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
      <div className="mb-6 pb-3 border-b border-white/[0.08]">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {template.name}
        </h1>
      </div>

      {/* Frame Error Alert */}
      {frameError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{frameError}</span>
        </div>
      )}

      {/* User Input Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="btn-pill btn-pill-danger h-6 px-3 text-xs font-medium"
          >
            <span className="pill-specular" aria-hidden="true" />
            <span className="btn-label">Tutup</span>
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
            caption={caption}
            participantName={participantName}
            onParticipantNameChange={handleParticipantNameChange}
            onUploadFile={handlePhotoUpload}
            onRemovePhoto={handleRemovePhoto}
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
        captionText={caption.text}
        templateName={template.name}
      />
    </div>
  );
};
