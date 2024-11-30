export interface MediaFormats {
  image: string[];
  video: string[];
  audio: string[];
}

export interface MediaPreviewConfig {
  max_width: number;
  max_height: number;
  lazy_load: boolean;
  formats: MediaFormats;
  click_to_expand: boolean;
}

export interface Message {
  content: string;
  containsMedia?: boolean;
  [key: string]: any;
}

export type MediaType = 'image' | 'video' | 'audio' | null; 