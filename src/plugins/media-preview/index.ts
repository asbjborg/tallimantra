import { Plugin } from '../types';
import { MediaPreviewConfig, Message, MediaType } from './types';
import { eventBus } from '../core/eventBus';

const URL_REGEX = /https?:\/\/[^\s<>]+?\.(?:jpg|jpeg|png|gif|webp|mp4|webm|mp3|wav)(?:\?[^\s<>]+)?/gi;

class MediaPreviewPlugin {
  private config: MediaPreviewConfig;
  private styleElement?: HTMLStyleElement;

  constructor(config: Partial<MediaPreviewConfig> = {}) {
    this.config = {
      max_width: 800,
      max_height: 600,
      lazy_load: true,
      formats: {
        image: ["jpg", "jpeg", "png", "gif", "webp"],
        video: ["mp4", "webm"],
        audio: ["mp3", "wav"]
      },
      click_to_expand: true,
      ...config
    };
  }

  async processMessage(message: Message): Promise<Message> {
    const urls = message.content.match(URL_REGEX) || [];
    if (urls.length === 0) return message;

    const previews = urls.map(url => this.createPreview(url));
    
    let modifiedContent = message.content;
    urls.forEach((url, index) => {
      modifiedContent = modifiedContent.replace(url, previews[index]);
    });

    return {
      ...message,
      content: modifiedContent,
      containsMedia: true
    };
  }

  private createPreview(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase().split('?')[0] || '';
    const type = this.getMediaType(extension);

    if (!type) return url;

    const style = `max-width: ${this.config.max_width}px; max-height: ${this.config.max_height}px;`;
    const loading = this.config.lazy_load ? 'loading="lazy"' : '';
    const expandable = this.config.click_to_expand ? 'class="expandable-media"' : '';

    switch (type) {
      case 'image':
        return `<img src="${url}" alt="Media preview" style="${style}" ${loading} ${expandable}>`;
      case 'video':
        return `<video controls style="${style}" ${loading} ${expandable}><source src="${url}"></video>`;
      case 'audio':
        return `<audio controls style="${style}" ${loading}><source src="${url}"></audio>`;
      default:
        return url;
    }
  }

  private getMediaType(extension: string): MediaType {
    for (const [type, formats] of Object.entries(this.config.formats)) {
      if (formats.includes(extension)) return type as MediaType;
    }
    return null;
  }

  private setupExpandableMedia(): void {
    if (!this.config.click_to_expand) return;

    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      .expandable-media {
        cursor: pointer;
        transition: transform 0.2s;
      }
      .expandable-media.expanded {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.5);
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 5px;
      }
    `;
    document.head.appendChild(this.styleElement);

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('expandable-media')) {
        target.classList.toggle('expanded');
      }
    });
  }

  private cleanup(): void {
    if (this.styleElement) {
      this.styleElement.remove();
    }
  }
}

const plugin: Plugin = {
  id: '@tallimantra/media-preview',
  name: '@tallimantra/media-preview',
  version: '0.1.0',
  description: 'Automatically detects and renders media URLs inline in your chat feed',
  author: 'Tallimantra',
  dependencies: {
    '@tallimantra/core': '^0.1.0'
  },

  async initialize() {
    console.log('Media Preview plugin initializing...');
    const mediaPreview = new MediaPreviewPlugin();
    
    // Subscribe to message events from the core event bus
    eventBus.onAsync('message', async (message: Message) => {
      const processedMessage = await mediaPreview.processMessage(message);
      await eventBus.emitAsync('message:processed', processedMessage);
    });
  },

  async activate() {
    console.log('Media Preview plugin activated!');
  },

  async deactivate() {
    console.log('Media Preview plugin deactivated.');
  }
};

export default plugin; 