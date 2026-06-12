export interface DownloadSettings {
  url: string;
  platform: string;
  quality: 'best' | '1080p' | '720p' | '480p' | 'audio';
  audioFormat: 'mp3' | 'm4a' | 'wav';
  savePath: string;
  useCustomFilename: boolean;
  filenameTemplate: string;
  embedSubtitles: boolean;
  embedThumbnail: boolean;
  keepVideo: boolean; // if extracting audio
  playlistOption: 'all' | 'item' | 'none';
  customArgs: string;
}

export interface PlatformMetadata {
  id: string;
  name: string;
  icon: string;
  defaultUrlPlaceholder: string;
  tips: string[];
  recommendedFlags: string[];
}
