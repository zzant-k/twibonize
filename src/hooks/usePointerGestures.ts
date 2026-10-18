import React, { useRef, useCallback } from 'react';

interface PointerGesturesOptions {
  outputWidth: number;
  outputHeight: number;
  scale: number;
  onDeltaMove: (deltaX: number, deltaY: number) => void;
  onScaleChange: (newScale: number | ((prev: number) => number)) => void;
}

export function usePointerGestures({
  outputWidth,
  scale,
  onDeltaMove,
  onScaleChange,
}: PointerGesturesOptions) {
  // Simpan pointer aktif: pointerId -> { clientX, clientY }
  const activePointersRef = useRef<Map<number, { clientX: number; clientY: number }>>(new Map());
  const initialPinchDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(scale);
  const lastSinglePosRef = useRef<{ clientX: number; clientY: number } | null>(null);

  const getLogicalRatio = useCallback((target: HTMLElement): number => {
    const rect = target.getBoundingClientRect();
    if (!rect.width || outputWidth <= 0) return 1.0;
    return rect.width / outputWidth;
  }, [outputWidth]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Browser fallback jika setPointerCapture tidak didukung
    }

    activePointersRef.current.set(e.pointerId, {
      clientX: e.clientX,
      clientY: e.clientY,
    });

    const count = activePointersRef.current.size;

    if (count === 1) {
      lastSinglePosRef.current = { clientX: e.clientX, clientY: e.clientY };
      initialPinchDistRef.current = null;
    } else if (count === 2) {
      // Mulai pinch-to-zoom dengan 2 jari
      const pts = Array.from(activePointersRef.current.values());
      const p1 = pts[0];
      const p2 = pts[1];
      const dist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      initialPinchDistRef.current = dist > 0 ? dist : 1;
      initialScaleRef.current = scale;
      lastSinglePosRef.current = null;
    }
  }, [scale]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activePointersRef.current.has(e.pointerId)) return;

    activePointersRef.current.set(e.pointerId, {
      clientX: e.clientX,
      clientY: e.clientY,
    });

    const count = activePointersRef.current.size;
    const ratio = getLogicalRatio(e.currentTarget);

    if (count === 1 && lastSinglePosRef.current) {
      const deltaX = (e.clientX - lastSinglePosRef.current.clientX) / ratio;
      const deltaY = (e.clientY - lastSinglePosRef.current.clientY) / ratio;

      onDeltaMove(deltaX, deltaY);
      lastSinglePosRef.current = { clientX: e.clientX, clientY: e.clientY };
    } else if (count === 2 && initialPinchDistRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const p1 = pts[0];
      const p2 = pts[1];
      const currentDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);

      if (initialPinchDistRef.current > 0) {
        const factor = currentDist / initialPinchDistRef.current;
        onScaleChange(initialScaleRef.current * factor);
      }
    }
  }, [getLogicalRatio, onDeltaMove, onScaleChange]);

  const handlePointerEnd = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    activePointersRef.current.delete(e.pointerId);
    const remainingCount = activePointersRef.current.size;

    if (remainingCount === 1) {
      // Kembali ke mode 1-pointer drag tanpa lompatan posisi
      const [remaining] = Array.from(activePointersRef.current.values());
      lastSinglePosRef.current = { clientX: remaining.clientX, clientY: remaining.clientY };
      initialPinchDistRef.current = null;
    } else if (remainingCount === 0) {
      lastSinglePosRef.current = null;
      initialPinchDistRef.current = null;
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    // Zoom in / out dengan mouse wheel
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    onScaleChange((prev) => prev + zoomDelta);
  }, [onScaleChange]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: handlePointerEnd,
    handlePointerCancel: handlePointerEnd,
    handleWheel,
  };
}
