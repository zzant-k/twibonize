/**
 * Obsidian Dark Glass Pill & Card Interaction System
 * Implements mouse-tracking dynamic sheen & synthesized haptic click from design_button.md
 */

let audioCtx: AudioContext | null = null;

/**
 * Web Audio API synthesized haptic acoustic pop
 * From design_button.md (Section 6)
 */
export function playPillClick(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);

    // Muted luxury ceramic/glass pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Autoplay or audio restrictions gracefully handled
  }
}

/**
 * Global dynamic mouse tracking and haptic trigger for Obsidian buttons and cards
 * From design_button.md (Section 5 & 6)
 */
export function setupPillInteractions(): () => void {
  if (typeof window === 'undefined') return () => {};

  let currentTarget: HTMLElement | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest?.('.btn-pill, .obsidian-card') as HTMLElement | null;

    if (target) {
      const rect = target.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      target.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
      target.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
      currentTarget = target;
    } else if (currentTarget) {
      currentTarget.style.setProperty('--mouse-x', '50%');
      currentTarget.style.setProperty('--mouse-y', '50%');
      currentTarget = null;
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    const target = (e.target as HTMLElement)?.closest?.('.btn-pill') as HTMLElement | null;
    if (target && !target.hasAttribute('disabled')) {
      playPillClick();
    }
  };

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('pointerdown', handlePointerDown, { passive: true });

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('pointerdown', handlePointerDown);
  };
}
