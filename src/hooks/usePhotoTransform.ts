import { useState, useCallback } from 'react';
import { PhotoTransform } from '../types/template';

export const MIN_SCALE = 0.3;
export const MAX_SCALE = 4.0;
export const DEFAULT_SCALE = 1.0;

const DEFAULT_TRANSFORM: PhotoTransform = {
  scale: DEFAULT_SCALE,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

export function usePhotoTransform() {
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM);

  const setScale = useCallback((newScale: number | ((prev: number) => number)) => {
    setTransform((prev) => {
      const val = typeof newScale === 'function' ? newScale(prev.scale) : newScale;
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, val));
      return { ...prev, scale: Math.round(clamped * 1000) / 1000 };
    });
  }, []);

  const setOffsetX = useCallback((x: number) => {
    setTransform((prev) => ({ ...prev, offsetX: Math.round(x) }));
  }, []);

  const setOffsetY = useCallback((y: number) => {
    setTransform((prev) => ({ ...prev, offsetY: Math.round(y) }));
  }, []);

  const setOffsets = useCallback((x: number, y: number) => {
    setTransform((prev) => ({ ...prev, offsetX: Math.round(x), offsetY: Math.round(y) }));
  }, []);

  const updateOffsetsByDelta = useCallback((deltaX: number, deltaY: number) => {
    setTransform((prev) => ({
      ...prev,
      offsetX: Math.round(prev.offsetX + deltaX),
      offsetY: Math.round(prev.offsetY + deltaY),
    }));
  }, []);

  const zoomIn = useCallback((step = 0.1) => {
    setScale((prev) => prev + step);
  }, [setScale]);

  const zoomOut = useCallback((step = 0.1) => {
    setScale((prev) => prev - step);
  }, [setScale]);

  const rotateClockwise = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  const resetTransform = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  return {
    transform,
    setScale,
    setOffsetX,
    setOffsetY,
    setOffsets,
    updateOffsetsByDelta,
    zoomIn,
    zoomOut,
    rotateClockwise,
    resetTransform,
  };
}
