# Twibbon Studio — Dedicated Single Twibbon (Apple-Inspired Design)

Website generator twibbon khusus dengan filosofi desain **Apple Human Interface Guidelines (HIG)** yang berfokus langsung pada **satu frame twibbon utama** tanpa halaman perantara atau galeri yang membingungkan.

### Alur Kerja:
1. **Pemilik**: Mengunggah file frame PNG transparan, memberi judul, menentukan rasio aspek (1:1, 4:5, 9:16), serta caption bawaan melalui tombol **"Atur Frame"**. Frame tersimpan secara permanen di browser (IndexedDB) dan menjadi tampilan utama situs.
2. **Pengunjung**: Begitu membuka situs web, pengunjung langsung berada di halaman twibbon tersebut. Mereka tinggal mengunggah foto pribadi, mengatur posisi/zoom dengan sentuhan atau mouse, dan langsung mengunduh hasil PNG resolusi penuh atau membagikannya ke media sosial.

---

## Fitur Utama

- 🎯 **Direct Single-Slide Twibbon**: Pengunjung langsung disajikan frame twibbon aktif yang siap pakai. Tidak ada hero banner atau galeri kartu yang mengalihkan perhatian.
- 🛠️ **Mode Unggah Frame Pemilik**: Pemilik dapat mengunggah frame PNG transparan baru kapan saja secara langsung dari antarmuka (tersimpan persisten di IndexedDB perangkat) atau mendaftarkannya di `src/data/templates.ts`.
- 🎨 **Apple-Inspired Design System**: Antarmuka bersih, minimalis, kontras tinggi, menggunakan palet netral (`#FFFFFF`, `#F5F5F7`, `#1D1D1F`, `#6E6E73`, `#0071E3`), tipografi San Francisco/Sistem OS, dan micro-interactions yang halus.
- 📐 **Sistem Koordinat Logis**: Transformasi foto (offset dan skala) disimpan dalam koordinat logis sebanding dengan dimensi template asli, memastikan hasil ekspor 100% identik dengan apa yang terlihat pada preview layar desktop maupun mobile.
- 🖐️ **Pointer Events & Gesture Lengkap**:
  - Drag foto dengan mouse, trackpad, sentuhan (touch), atau stylus.
  - Pinch-to-zoom dengan 2 jari pada perangkat layar sentuh.
  - Zoom slider dengan indikator persentase real-time serta tombol zoom in / zoom out.
  - Slider fine-tuning posisi horizontal (X) dan vertikal (Y).
  - Rotasi 90° searah jarum jam.
  - Tombol reset posisi & zoom ke penyesuaian awal (*cover mode*).
- ✍️ **Caption Editor Terintegrasi**: Mengatur teks nama/pesan, perataan (kiri, tengah, kanan), ukuran huruf dinamis, serta pilihan warna berkelas.
- 🔒 **100% Privasi di Browser Pengguna**: Seluruh pemrosesan gambar dijalankan di sisi klien (client-side) menggunakan HTML5 Canvas API dan Browser File API. Foto pengguna **tidak pernah dikirim ke server**.
- 🚀 **High-Resolution PNG Export**: Merender seluruh layer pada resolusi asli (misal: 1080×1080, 1080×1350, 1080×1920) dengan transparansi PNG terjaga dan kompresi tanpa cacat.
- 📲 **Sharing & Instagram Workflow**:
  - Mendukung Web Share API bawaan peramban untuk berbagi file langsung ke aplikasi lain jika didukung perangkat.
  - Fallback unduh instan jika berbagi file langsung tidak didukung browser.
  - Tombol salin caption sekali klik.
  - Panduan praktis untuk membuka Instagram dan mengunggah dari galeri.

---

## Teknologi yang Digunakan

- **React 19** & **TypeScript** (Strict Mode).
- **Vite** untuk build tool dan dev server ultra-cepat.
- **Tailwind CSS** untuk styling berbasis token desain Apple.
- **Lucide React** untuk icon set minimalis.
- **HTML5 Canvas API** untuk komposisi multi-layer dan ekspor gambar.
- **Browser File & Pointer APIs** untuk pembacaan foto dan gesture sentuh.

---

## Struktur Proyek

```text
twinbonoize/
├── public/
│   ├── frames/                 # File PNG transparan untuk frame twibbon
│   │   ├── graduation-2026.png
│   │   ├── youth-pledge.png
│   │   ├── eid-mubarak.png
│   │   ├── creative-fest.png
│   │   ├── tech-summit.png
│   │   └── previews/           # Thumbnail preview frame
│   └── test-portrait.jpg       # Foto sampel pengujian
├── src/
│   ├── components/
│   │   ├── editor/             # Canvas preview, controls, caption, dan export modal
│   │   │   ├── EditorCanvas.tsx
│   │   │   ├── EditorControls.tsx
│   │   │   ├── CaptionControls.tsx
│   │   │   ├── ExportModal.tsx
│   │   │   └── PhotoEditor.tsx
│   │   ├── gallery/            # Hero section, gallery grid, dan kartu frame
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   └── TemplateGallery.tsx
│   │   ├── layout/             # Navbar, Footer, dan Modal Jaminan Privasi
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PrivacyModal.tsx
│   │   └── ui/                 # Komponen atomik Apple (Button, Badge, Slider, Modal)
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Slider.tsx
│   │       └── Modal.tsx
│   ├── data/
│   │   └── templates.ts        # Konfigurasi data terpusat semua template
│   ├── hooks/                  # Custom hooks: useImageLoader, usePhotoTransform, usePointerGestures
│   ├── lib/                    # Canvas renderer, engine ekspor resolusi tinggi, Web Share API
│   ├── types/                  # Definisi TypeScript untuk template, koordinat, dan caption
│   ├── App.tsx                 # Root application controller
│   ├── main.tsx                # React DOM entry
│   └── index.css               # Apple design tokens, Tailwind directives, styling range input
├── vercel.json                 # Konfigurasi deployment static SPA dan asset cache Vercel
└── tailwind.config.js          # Konfigurasi token warna, font, dan bayangan Apple
```

---

## Menjalankan Proyek Secara Lokal

Pastikan Node.js (versi 18 ke atas) telah terinstal di komputer Anda.

1. **Instal dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser di `http://localhost:5173/`.

3. **Membuat build produksi**:
   ```bash
   npm run build
   ```

4. **Menjalankan preview build produksi**:
   ```bash
   npm run preview
   ```

5. **Menjalankan lint code audit**:
   ```bash
   npm run lint
   ```

---

## Panduan Pemilik: Cara Menambahkan Frame Baru

Sebagai pemilik website, Anda dapat menambahkan frame baru tanpa perlu mengubah kode logika editor:

### 1. Siapkan File Desain Frame
- Buat desain frame Anda pada software desain grafis (Figma, Photoshop, Illustrator, Canva, dll).
- Pastikan area tempat foto pengguna berada memiliki latar belakang **transparan (alpha channel)**.
- Ekspor desain ke format **PNG 24-bit atau 32-bit (Transparan)**.

### 2. Masukkan File ke Folder Proyek
- Letakkan file PNG ukuran penuh ke folder:
  ```text
  public/frames/nama-frame-anda.png
  ```
- *(Opsional)* Simpan file thumbnail ke:
  ```text
  public/frames/previews/nama-frame-anda.png
  ```
  *(Jika thumbnail tidak disediakan, aplikasi otomatis menggunakan file frame utama).*

### 3. Daftarkan di `src/data/templates.ts`
Buka file `src/data/templates.ts` dan tambahkan objek baru ke array `TEMPLATES`:

```typescript
{
  id: 'nama-frame-anda',
  name: 'Nama Frame Keren',
  description: 'Deskripsi singkat mengenai frame ini.',
  category: 'Kategori', // Contoh: 'Wisuda', 'Event', 'Nasional', 'Komunitas'
  frameUrl: '/frames/nama-frame-anda.png',
  previewUrl: '/frames/previews/nama-frame-anda.png',
  aspectRatio: '4:5', // '1:1', '4:5', '9:16', '16:9'
  outputWidth: 1080,
  outputHeight: 1350,
  defaultCaption: 'Teks caption default opsional...',
  allowCaption: true, // true jika mengizinkan teks, false jika tidak
  captionConfig: {
    position: 'bottom',
    yPercent: 80,
    defaultColor: '#FFFFFF',
    defaultAlign: 'center',
    minFontSize: 24,
    maxFontSize: 48,
    defaultFontSize: 32,
  },
  isPublished: true, // Set false jika ingin menyembunyikan sementara
}
```

Setelah disimpan, frame baru akan langsung muncul di galeri utama!

---

## Panduan Mengatur Dimensi & Rasio Aspek Ekspor

Twibbon Studio mendukung berbagai format rasio dan resolusi ekspor:

| Penggunaan Umum | Rasio Aspek | Dimensi Rekomendasi (`outputWidth` × `outputHeight`) |
| :--- | :--- | :--- |
| **Instagram Feed (Kotak)** | `1:1` | `1080 × 1080` piksel |
| **Instagram Feed (Potret)** | `4:5` | `1080 × 1350` piksel |
| **Instagram Story / Reels / WhatsApp Status** | `9:16` | `1080 × 1920` piksel |
| **Twitter / Facebook Banner** | `16:9` | `1920 × 1080` piksel |

---

## Deployment ke Vercel

Aplikasi ini 100% frontend statis, sehingga sangat ringan dan cepat di-deploy ke **Vercel**:

1. Inisialisasi Git dan dorong repository ke GitHub atau GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Twibbon Studio"
   git remote add origin https://github.com/username/twibbon-studio.git
   git push -u origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com/) dan klik **Add New Project**.
3. Import repository GitHub/GitLab Anda.
4. Vercel akan otomatis mendeteksi framework **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy**. Website Anda akan aktif dalam hitungan detik dengan SSL HTTPS gratis dan domain bawaan `.vercel.app`.

File `vercel.json` sudah disediakan dalam proyek untuk menangani Single-Page App (SPA) URL rewrites dan HTTP header caching jangka panjang pada aset frame.

---

## Penjelasan Keterbatasan Sharing Instagram

Browser web standar (di desktop maupun mobile) **tidak memiliki izin atau akses langsung** untuk membuka antarmuka posting Instagram Feed dan langsung mempublikasikannya secara otomatis tanpa otentikasi login pengguna.

Oleh karena itu, Twibbon Studio menerapkan alur kerja standar yang mulus dan realistis:

1. **Web Share API**: Pada browser mobile yang kompatibel (seperti Safari di iOS atau Chrome di Android), menekan tombol "Bagikan" akan membuka lembar berbagi sistem operasi asli (*native share sheet*), sehingga pengguna dapat langsung memilih icon Instagram atau WhatsApp.
2. **Fallback Otomatis**: Jika browser tidak mendukung berbagi file langsung, tombol "Unduh Gambar" akan otomatis menyimpan PNG resolusi penuh ke folder Unduhan atau Galeri perangkat.
3. **Salin Caption**: Pengguna dapat menyalin teks caption yang telah disiapkan hanya dengan satu ketukan.
4. **Buka Instagram**: Tombol tautan langsung disediakan untuk membuka aplikasi atau situs web Instagram, di mana pengguna tinggal memilih foto hasil unduhan dari galeri mereka.
