import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Upload, Move, Loader2, ImagePlus } from 'lucide-react';
import { TwibbonTemplate, PhotoTransform, PhotoSource } from '../../types/template';
import { renderTwibbonLayers } from '../../lib/canvasRenderer';
import { usePointerGestures } from '../../hooks/usePointerGestures';

interface EditorCanvasProps {
  template: TwibbonTemplate;
  frameImage: HTMLImageElement | null;
  photoSource: PhotoSource | null;
  transform: PhotoTransform;
  onDeltaMove: (deltaX: number, deltaY: number) => void;
  onScaleChange: (newScale: number | ((prev: number) => number)) => void;
  onUploadClick: () => void;
  onDropFile: (file: File) => void;
  isFrameLoading: boolean;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  template,
  frameImage,
  photoSource,
  transform,
  onDeltaMove,
  onScaleChange,
  onUploadClick,
  onDropFile,
  isFrameLoading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleWheel,
  } = usePointerGestures({
    outputWidth: template.outputWidth,
    outputHeight: template.outputHeight,
    scale: transform.scale,
    onDeltaMove,
    onScaleChange,
  });

  // Re-render canvas whenever template, frameImage, photoSource, transform, or caption changes
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Gunakan DPR untuk rendering tajam pada layar Retina / High-DPI
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || 360;
    const displayHeight = (displayWidth / template.outputWidth) * template.outputHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    const renderScale = (displayWidth * dpr) / template.outputWidth;

    renderTwibbonLayers({
      ctx,
      template,
      frameImage,
      photoImage: photoSource ? photoSource.imageElement : null,
      transform,
      renderScale,
    });
  }, [template, frameImage, photoSource, transform]);

  useEffect(() => {
    let animId: number;
    animId = requestAnimationFrame(renderCanvas);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Window resize observer to update canvas display dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      renderCanvas();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [renderCanvas]);

  // Drag and drop file handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onDropFile(file);
    }
  };

  // Hitung aspect ratio container untuk menjaga proporsi asli template
  const aspectStyle = {
    aspectRatio: `${template.outputWidth} / ${template.outputHeight}`,
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full max-w-[460px] mx-auto rounded-2xl overflow-hidden select-none border transition-all duration-200 bg-[#121212] shadow-2xl ${
        isDragOver
          ? 'border-blue-500 ring-4 ring-blue-500/20'
          : 'border-[#262626]'
      }`}
      style={aspectStyle}
    >
      {/* Background subtle dot pattern matching CreatorProfilePage */}
      <div
        className="absolute inset-0 -z-10 bg-[#121212]"
        style={{
          backgroundImage: 'radial-gradient(#333333 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={photoSource ? handlePointerDown : undefined}
        onPointerMove={photoSource ? handlePointerMove : undefined}
        onPointerUp={photoSource ? handlePointerUp : undefined}
        onPointerCancel={photoSource ? handlePointerCancel : undefined}
        onWheel={photoSource ? handleWheel : undefined}
        className={`w-full h-full block touch-none ${
          photoSource ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        style={{ touchAction: 'none' }}
      />

      {/* Frame Loading Overlay */}
      {isFrameLoading && (
        <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-xs flex flex-col items-center justify-center text-gray-300 text-xs gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Memuat frame...</span>
        </div>
      )}

      {/* Empty State: Belum ada foto diunggah */}
      {!photoSource && !isFrameLoading && (
        <div
          onClick={onUploadClick}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-black/40 hover:bg-black/60 transition-colors group"
        >
          <div className="w-14 h-14 rounded-full bg-[#222222] border border-[#333333] shadow-md flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-[#2c2c2c] transition-all">
            <Upload className="w-6 h-6" />
          </div>
        </div>
      )}

      {/* Subtle Drag Hint Overlay saat foto aktif */}
      {photoSource && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a1a]/90 backdrop-blur-md text-white border border-[#333333] text-[11px] font-medium shadow-sm">
            <Move className="w-3 h-3 text-blue-400" />
            <span>Sentuh &amp; geser untuk mengatur foto</span>
          </div>
        </div>
      )}

      {/* Drop zone visual feedback */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-xs border-2 border-dashed border-blue-500 flex flex-col items-center justify-center text-blue-400 pointer-events-none">
          <ImagePlus className="w-10 h-10 mb-2 animate-bounce" />
          <span className="text-sm font-semibold">Lepaskan foto untuk mengunggah</span>
        </div>
      )}
    </div>
  );
};
