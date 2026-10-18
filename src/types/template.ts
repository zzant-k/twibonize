export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | string;

export interface PhotoAreaConfig {
  shape?: 'rect' | 'circle' | 'rounded';
  xPercent?: number; // 0 to 100
  yPercent?: number; // 0 to 100
  widthPercent?: number; // 0 to 100
  heightPercent?: number; // 0 to 100
  borderRadius?: number; // in logical px
}

export interface CaptionConfig {
  position?: 'top' | 'bottom' | 'custom';
  yPercent?: number; // 0 to 100, default ~88%
  defaultColor?: string; // e.g. '#FFFFFF'
  defaultAlign?: 'left' | 'center' | 'right';
  minFontSize?: number; // in logical px
  maxFontSize?: number; // in logical px
  defaultFontSize?: number; // in logical px
}

export interface TwibbonTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  frameUrl: string;
  previewUrl?: string;
  aspectRatio: AspectRatio;
  outputWidth: number;
  outputHeight: number;
  defaultCaption?: string;
  allowCaption: boolean;
  captionConfig?: CaptionConfig;
  photoArea?: PhotoAreaConfig;
  isPublished: boolean;
}

export interface PhotoTransform {
  scale: number; // Relative scale multiplier (1.0 = base cover fit)
  offsetX: number; // Offset X in logical canvas coordinates
  offsetY: number; // Offset Y in logical canvas coordinates
  rotation: number; // 0, 90, 180, 270 degrees
}

export interface CaptionState {
  enabled: boolean;
  text: string;
  align: 'left' | 'center' | 'right';
  fontSize: number;
  color: string;
}

export interface PhotoSource {
  file: File;
  url: string;
  width: number;
  height: number;
  imageElement: HTMLImageElement;
}
