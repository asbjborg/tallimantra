# Media Preview Plugin

Automatically detects and renders media URLs (images, videos, audio) inline in your chat feed.

## Features

- Inline image preview from URLs
- Supports common image formats (jpg, png, gif, webp)
- Lazy loading for better performance
- Configurable preview sizes
- Optional click-to-expand

## Configuration

```json
{
  "max_width": 800,
  "max_height": 600,
  "lazy_load": true,
  "formats": {
    "image": ["jpg", "jpeg", "png", "gif", "webp"],
    "video": ["mp4", "webm"],  // Future support
    "audio": ["mp3", "wav"]    // Future support
  },
  "click_to_expand": true
}
```

## URL Detection

The plugin detects URLs that:
1. End with supported file extensions
2. Come from known image hosting services
3. Match common image URL patterns

Example patterns:
- Direct file URLs: `https://example.com/image.jpg`
- Imgur: `https://i.imgur.com/xxxxx.jpg`
- Discord CDN: `https://cdn.discordapp.com/attachments/xxxxx/xxxxx/image.png`

## Usage with n8n-webhook

Perfect companion for the n8n-webhook plugin. Your n8n workflow can return image URLs as text:

```json
{
  "response": "Here's your generated image: https://example.com/image.jpg"
}
```

The media-preview plugin will automatically detect and render the image inline.

## Roadmap

- [ ] Video preview support
- [ ] Audio player support
- [ ] Gallery view for multiple media items
- [ ] Media metadata display (size, dimensions)
- [ ] Custom preview templates 