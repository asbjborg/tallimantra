const URL_REGEX = /https?:\/\/[^\s<>]+?\.(?:jpg|jpeg|png|gif|webp|mp4|webm|mp3|wav)(?:\?[^\s<>]+)?/gi;

export default class MediaPreviewPlugin {
  constructor(config) {
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

  // Process message content to find and render media URLs
  async processMessage(message) {
    const urls = message.content.match(URL_REGEX) || [];
    if (urls.length === 0) return message;

    // Create preview elements for each URL
    const previews = urls.map(url => this.createPreview(url));
    
    // Replace URLs with preview elements in the message
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

  // Create HTML for media preview
  createPreview(url) {
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    const type = this.getMediaType(extension);

    if (!type) return url; // Return original URL if type not supported

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

  // Determine media type from file extension
  getMediaType(extension) {
    for (const [type, formats] of Object.entries(this.config.formats)) {
      if (formats.includes(extension)) return type;
    }
    return null;
  }

  // Plugin lifecycle methods
  async onLoad() {
    // Add CSS for expandable media
    if (this.config.click_to_expand) {
      const style = document.createElement('style');
      style.textContent = `
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
      document.head.appendChild(style);

      // Add click handler for expandable media
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('expandable-media')) {
          e.target.classList.toggle('expanded');
        }
      });
    }
  }

  async onUnload() {
    // Cleanup if needed
  }
} 