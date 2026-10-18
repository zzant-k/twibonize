import React from 'react';
import { ShieldCheck, Lock, EyeOff, Cpu, HardDriveDownload } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Jaminan Privasi 100% Lokal"
      description="Bagaimana Twibbon Studio melindungi foto dan privasi Anda."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 pt-1 text-left text-xs text-apple-secondary">
        <div className="flex items-start gap-3 p-3 rounded-apple bg-emerald-50/70 border border-emerald-200/60 text-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Foto yang Anda gunakan <strong>tidak pernah dikirim ke server mana pun</strong>.
            Semua proses pengeditan, pengaturan posisi, dan render gambar akhir terjadi secara eksklusif di dalam memori browser perangkat Anda.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-apple-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-apple-text">Pemrosesan Berbasis HTML5 Canvas</h4>
              <p className="mt-0.5 leading-snug">
                Gambar Anda dikomposisikan menggunakan Canvas API bawaan peramban web modern Anda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-apple-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-apple-text">Tanpa Penyimpanan Permanen</h4>
              <p className="mt-0.5 leading-snug">
                Kami tidak memiliki database atau penyimpanan cloud untuk foto pengguna. Begitu Anda menutup atau me-refresh tab browser, data foto akan otomatis terhapus dari memori.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-apple-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-apple-text">Bebas Pelacak &amp; Watermark</h4>
              <p className="mt-0.5 leading-snug">
                Twibbon Studio dibuat untuk kenyamanan dan kebebasan Anda tanpa iklan pelacak maupun watermark logo di hasil unduhan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <HardDriveDownload className="w-4 h-4 text-apple-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-apple-text">Unduhan Langsung</h4>
              <p className="mt-0.5 leading-snug">
                File PNG beresolusi tinggi dihasilkan langsung dari memori perangkat dan diunduh ke folder penyimpanan lokal Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="md" fullWidth onClick={onClose}>
            Saya Mengerti
          </Button>
        </div>
      </div>
    </Modal>
  );
};
