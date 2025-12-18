
export interface VideoMetadata {
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
  platform: 'youtube' | 'tiktok' | 'unknown';
  qualityOptions: QualityOption[];
}

export interface QualityOption {
  id: string;
  label: string;
  size: string;
  format: string;
  isWatermarkFree: boolean;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  DOWNLOADING = 'DOWNLOADING'
}

export interface DownloadState {
  optionId: string | null;
  progress: number;
  statusText: string;
}
