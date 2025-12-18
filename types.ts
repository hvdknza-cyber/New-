
export interface VideoMetadata {
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
  platform: 'youtube' | 'tiktok' | 'unknown';
  qualityOptions: QualityOption[];
}

export interface QualityOption {
  label: string;
  size: string;
  format: string;
  isWatermarkFree: boolean;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
