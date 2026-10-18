import React, { useState } from 'react';
import { Download, Share2, Copy, Check, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { ExportResult, triggerFileDownload } from '../../lib/imageExport';
import { shareTwibbon, copyCaptionToClipboard, openInstagram } from '../../lib/shareImage';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportResult: ExportResult | null;
  captionText?: string;
  templateName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  exportResult,
  captionText = '',
  templateName,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  if (!exportResult) return null;

  const handleDownloadAgain = () => {
    triggerFileDownload(exportResult.objectUrl, exportResult.filename);
  };

  const handleShare = async () => {
    setShareFeedback(null);
    const result = await shareTwibbon({
      file: exportResult.file,
      title: `Twibbon ${templateName}`,
      text: captionText || `Twibbon ${templateName}`,
    });

    if (result.success) {
      setShareFeedback('Twibbon berhasil dibagikan!');
    } else if (result.cancelled) {
      // User cancelled share dialog, no warning needed
    } else if (result.unsupported) {
      setShareFeedback('Browser ini belum mendukung berbagi file langsung. Silakan gunakan tombol unduh.');
    } else {
      setShareFeedback(result.error);
    }
  };

  const handleCopyCaption = async () => {
    if (!captionText) return;
    const ok = await copyCaptionToClipboard(captionText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gambar Siap Digunakan!"
      description={`Hasil twibbon ${templateName} telah berhasil di-render dalam resolusi penuh.`}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5 pt-2">
        {/* Rendered Preview Card */}
        <div className="relative rounded-apple overflow-hidden border border-apple-border/50 bg-apple-surface/60 flex items-center justify-center p-3 max-h-[300px]">
          <img
            src={exportResult.objectUrl}
            alt={exportResult.filename}
            className="max-h-[260px] w-auto object-contain rounded shadow-subtle"
          />
        </div>

        {/* File Metadata */}
        <div className="flex items-center justify-between text-xs text-apple-secondary bg-apple-surface/50 p-2.5 rounded-apple border border-apple-border/30">
          <span className="font-mono truncate max-w-[200px]">
            {exportResult.filename}
          </span>
          <span className="shrink-0 font-medium text-apple-text">
            {exportResult.width} × {exportResult.height} px (PNG Asli)
          </span>
        </div>

        {/* Share feedback alert */}
        {shareFeedback && (
          <div className="p-3 rounded-apple bg-blue-50 border border-blue-200 text-xs text-apple-blue flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{shareFeedback}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadAgain}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Unduh Lagi
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4 text-apple-blue" />}
            >
              Bagikan
            </Button>
          </div>

          {captionText && (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleCopyCaption}
              leftIcon={
                copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )
              }
            >
              {copied ? 'Caption Berhasil Disalin!' : 'Salin Caption'}
            </Button>
          )}

          {/* Instagram Flow Guide */}
          <div className="mt-2 p-3.5 rounded-apple bg-apple-surface/60 border border-apple-border/40 text-left flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-apple-text flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ingin unggah ke Instagram?
              </span>
              <button
                type="button"
                onClick={openInstagram}
                className="inline-flex items-center gap-1 text-xs font-medium text-apple-blue hover:underline"
              >
                <span>Buka Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <ol className="text-[11px] text-apple-secondary list-decimal list-inside space-y-0.5 leading-relaxed">
              <li>Gambar otomatis tersimpan di folder Unduhan/Galeri perangkat Anda.</li>
              <li>Salin caption di atas jika ingin menyertakan teks.</li>
              <li>Buka aplikasi Instagram, buat Story atau Postingan, dan pilih gambar ini.</li>
            </ol>
          </div>
        </div>
      </div>
    </Modal>
  );
};
