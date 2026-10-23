# Design Specification: Continuous Pill (Obsidian Dark Glass)

Dokumentasi spesifikasi desain, token warna, struktur markup, dan implementasi styling untuk tombol **Continuous Pill — Obsidian Dark Glass Capsule (Seamless Glass)**.

---

## 1. Filosofi & Karakteristik Desain

- **Prinsip Utama**: *Softness through silhouette & canvas fusion*.
- **Konsep Material**: Kapsul kaca hitam obsidian yang warnanya hampir menyatu (*fuse*) dengan latar belakang gelap (`#141517`). 
- **Definisi Bentuk**: Bentuk kapsul tidak ditegaskan dengan warna kontras yang mencolok, melainkan ditonjolkan secara elegan melalui:
  1. **Specular Rim Lighting**: Garis kilau tipis di lingkar dalam (`inset 0 1px 1px rgba(255,255,255,0.22)`).
  2. **Top Crescent Lens**: Lapisan kilau lembut di setengah lingkaran atas (`.pill-specular`).
  3. **Cursor-Aware Dynamic Sheen**: Sorotan cahaya halus di permukaan yang mengikuti pergerakan kursor mouse (`--mouse-x`, `--mouse-y`).
  4. **Spring Micro-Elevation**: Elevasi mengapung halus (-2px) saat disentuh kursor.

---

## 2. Token & Nilai Warna (Design Tokens)

| Properti | Nilai Token | Deskripsi |
|---|---|---|
| **Canvas Background** | `#141517` | Latar belakang canvas gelap |
| **Pill Base Gradient** | `linear-gradient(180deg, #1A1C1F 0%, #141517 55%, #0F1012 100%)` | Gradien badan tombol yang membaur dengan latar |
| **Cursor Sheen** | `radial-gradient(circle 90px at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.08) 0%, transparent 70%)` | Sorotan specular radial dinamis |
| **Top Crescent Sheen** | `linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0) 100%)` | Refleksi lensa atas |
| **Border Rim** | `1px solid rgba(255, 255, 255, 0.09)` | Garis batas tipis mikro |
| **Hover Border** | `1px solid rgba(255, 255, 255, 0.20)` | Peningkatan kontras batas saat hover |
| **Text Color** | `#FFFFFF` | Putih murni kontras tinggi |
| **Corner Radius** | `9999px` | Siluet kapsul penuh kontinu (*pill*) |
| **Min Height / Target** | `44px` | Standar ergonomis touch target |

---

## 3. Struktur HTML (Semantic Markup)

```html
<button type="button" class="btn-pill" id="btn-pill">
  <!-- Lapisan kilau lensa lengkungan atas -->
  <span class="pill-specular" aria-hidden="true"></span>
  <!-- Label teks utama -->
  <span class="btn-label">Explore More</span>
</button>
```

---

## 4. Styling Lengkap (CSS)

```css
/* ==========================================================================
   CONTINUOUS PILL — OBSIDIAN DARK GLASS CAPSULE
   ========================================================================== */
.btn-pill {
  /* Default koordinat kursor */
  --mouse-x: 50%;
  --mouse-y: 50%;

  /* Variabel Motion Curve */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fluid: 240ms;
  --duration-snap: 160ms;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  border: none;
  text-decoration: none;

  /* Geometri & Spacing */
  padding: 0.75rem 1.875rem;
  min-height: 44px;
  border-radius: 9999px;
  overflow: hidden;

  /* Tipografi */
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
  color: #FFFFFF;
  font-size: 0.84375rem;
  font-weight: 550;
  letter-spacing: 0.025em;

  /* Permukaan: Lapisan cahaya dinamis + gradien obsidian */
  background:
    radial-gradient(
      circle 90px at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.08) 0%,
      transparent 70%
    ),
    linear-gradient(180deg, #1A1C1F 0%, #141517 55%, #0F1012 100%);

  /* Border & Rim specular yang lembut */
  border: 1px solid rgba(255, 255, 255, 0.09);

  /* Multi-level box-shadow: ambient drop shadow + internal specular occlusion */
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.4),
    0 8px 18px -4px rgba(0, 0, 0, 0.55),
    inset 0 1px 1px rgba(255, 255, 255, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 -1.5px 2px rgba(0, 0, 0, 0.6);

  /* Transisi Halus */
  transition: transform var(--duration-snap) var(--ease-spring),
              background var(--duration-fluid) var(--ease-spring),
              box-shadow var(--duration-fluid) var(--ease-spring),
              border-color var(--duration-fluid) var(--ease-spring);
}

/* Lapisan Lensa Bulan Sabit di Bagian Atas */
.btn-pill .pill-specular {
  position: absolute;
  top: 1px;
  left: 12%;
  right: 12%;
  height: 45%;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.09) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

/* Label Teks (Memastikan di atas lapisan specular) */
.btn-pill .btn-label {
  position: relative;
  z-index: 2;
}

/* --------------------------------------------------------------------------
   Hover State
   - Mengapung -2px
   - Rim lebih terang
   - Sorotan specular radial menguat
   - Bayangan ambient melebar
   -------------------------------------------------------------------------- */
.btn-pill:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
  background:
    radial-gradient(
      circle 90px at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.12) 0%,
      transparent 70%
    ),
    linear-gradient(180deg, #1F2226 0%, #16181B 55%, #111214 100%);
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.5),
    0 12px 26px -4px rgba(0, 0, 0, 0.65),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 -1.5px 2px rgba(0, 0, 0, 0.7);
}

/* --------------------------------------------------------------------------
   Active / Press State
   - Menekan ke bawah (+0.5px)
   - Bayangan mengempis
   -------------------------------------------------------------------------- */
.btn-pill:active {
  transform: translateY(0.5px);
  background: linear-gradient(180deg, #131416 0%, #0F1012 100%);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(0, 0, 0, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

/* --------------------------------------------------------------------------
   Focus-Visible (Keyboard Navigation)
   -------------------------------------------------------------------------- */
.btn-pill:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 4px;
}

/* --------------------------------------------------------------------------
   Accessibility: Reduced Motion
   -------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .btn-pill {
    transition: none !important;
  }
  .btn-pill:hover,
  .btn-pill:active {
    transform: none !important;
  }
}
```

---

## 5. JavaScript Interaktif (Pelacak Kursor Mouse)

Script ringan ini menghitung posisi koordinat mouse terhadap tombol dan mengupdate variabel `--mouse-x` dan `--mouse-y` secara *real-time*:

```javascript
document.querySelectorAll('.btn-pill').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
    btn.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
  });

  btn.addEventListener('mouseleave', () => {
    // Kembali ke posisi tengah saat kursor keluar
    btn.style.setProperty('--mouse-x', '50%');
    btn.style.setProperty('--mouse-y', '50%');
  });
});
```

---

## 6. Synthesized Haptic Sound (Opsional - Web Audio API)

Untuk memberikan umpan balik taktil akustik (seperti klik tombol fisik) saat tombol ditekan:

```javascript
function playPillClick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);

    // Muted luxury ceramic/glass pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {}
}

document.getElementById('btn-pill')?.addEventListener('pointerdown', playPillClick);
```

---

## 7. Komponen Mandiri (Stand-Alone Ready to Use)

Jika ingin digunakan langsung di proyek lain secara mandiri:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Obsidian Pill Button</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #141517; /* Canvas background gelap */
    }

    .btn-pill {
      --mouse-x: 50%;
      --mouse-y: 50%;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.875rem;
      min-height: 44px;
      border-radius: 9999px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.09);
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 0.84375rem;
      font-weight: 550;
      letter-spacing: 0.025em;
      background:
        radial-gradient(
          circle 90px at var(--mouse-x) var(--mouse-y),
          rgba(255, 255, 255, 0.08) 0%,
          transparent 70%
        ),
        linear-gradient(180deg, #1A1C1F 0%, #141517 55%, #0F1012 100%);
      box-shadow:
        0 2px 5px rgba(0, 0, 0, 0.4),
        0 8px 18px -4px rgba(0, 0, 0, 0.55),
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        inset 0 0 0 1px rgba(255, 255, 255, 0.03),
        inset 0 -1.5px 2px rgba(0, 0, 0, 0.6);
      transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
                  background 240ms cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 240ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-pill .pill-specular {
      position: absolute;
      top: 1px;
      left: 12%;
      right: 12%;
      height: 45%;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0) 100%);
      pointer-events: none;
    }

    .btn-pill .btn-label {
      position: relative;
      z-index: 2;
    }

    .btn-pill:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.2);
      background:
        radial-gradient(
          circle 90px at var(--mouse-x) var(--mouse-y),
          rgba(255, 255, 255, 0.12) 0%,
          transparent 70%
        ),
        linear-gradient(180deg, #1F2226 0%, #16181B 55%, #111214 100%);
      box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.5),
        0 12px 26px -4px rgba(0, 0, 0, 0.65),
        inset 0 1px 1px rgba(255, 255, 255, 0.3),
        inset 0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 -1.5px 2px rgba(0, 0, 0, 0.7);
    }

    .btn-pill:active {
      transform: translateY(0.5px);
      background: linear-gradient(180deg, #131416 0%, #0F1012 100%);
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.5),
        inset 0 2px 4px rgba(0, 0, 0, 0.7),
        inset 0 0 0 1px rgba(255, 255, 255, 0.02);
    }

    .btn-pill:focus-visible {
      outline: 2px solid #FFFFFF;
      outline-offset: 4px;
    }
  </style>
</head>
<body>

  <button type="button" class="btn-pill" id="btn-pill">
    <span class="pill-specular" aria-hidden="true"></span>
    <span class="btn-label">Explore More</span>
  </button>

  <script>
    const btn = document.querySelector('.btn-pill');
    if (btn) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
        btn.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mouse-x', '50%');
        btn.style.setProperty('--mouse-y', '50%');
      });
    }
  </script>
</body>
</html>
```
