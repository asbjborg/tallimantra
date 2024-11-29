# Plugin Implementation Examples

## Basic Plugin Structure

### Manifest File Example
```json
{
  "name": "weather-plugin",
  "version": "1.0.0",
  "description": "Weather information plugin",
  "permissions": ["http", "storage"],
  "entry": "index.js",
  "components": ["WeatherWidget"],
  "settings": {
    "apiKey": {
      "type": "string",
      "required": true,
      "secure": true
    }
  }
}
```

### Plugin Entry Point
```typescript
import { Plugin, PluginContext } from '@tallimantra/sdk';

export class WeatherPlugin implements Plugin {
  constructor(private context: PluginContext) {}

  async onLoad() {
    this.context.registerCommand('weather', this.handleWeatherCommand);
    this.context.registerComponent('WeatherWidget', WeatherWidget);
  }

  async onUnload() {
    // Cleanup code
  }

  private async handleWeatherCommand(args: string[]) {
    const location = args[0];
    const apiKey = await this.context.getSecureSetting('apiKey');
    // Implementation
  }
}
```

## UI Integration Example

### Custom Component
```tsx
import React from 'react';
import { usePluginContext } from '@tallimantra/sdk/hooks';

export const WeatherWidget: React.FC = () => {
  const { theme, settings } = usePluginContext();
  
  return (
    <div className={theme.card}>
      {/* Widget implementation */}
    </div>
  );
};
```

### Style Integration
```typescript
import { StyleSheet } from '@tallimantra/sdk/styles';

export const styles = StyleSheet.create({
  widget: {
    backgroundColor: 'var(--background)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
  }
});
```

## Chat Integration Example

### Message Handler
```typescript
export class TranslationPlugin implements Plugin {
  async onMessage(message: Message, context: MessageContext) {
    if (message.content.startsWith('/translate')) {
      const [_, text, lang] = message.content.split(' ');
      return await this.translate(text, lang);
    }
    return null;
  }
}
```

### Custom Renderer
```typescript
export class CodeHighlightPlugin implements Plugin {
  async onRenderMessage(message: Message) {
    if (message.type === 'code') {
      return {
        component: 'CodeBlock',
        props: {
          code: message.content,
          language: message.metadata.language
        }
      };
    }
    return null;
  }
}
```

## Advanced Examples

### State Management
```typescript
import { createPluginSlice } from '@tallimantra/sdk/state';

const weatherSlice = createPluginSlice({
  name: 'weather',
  initialState: {
    currentLocation: null,
    forecast: null
  },
  reducers: {
    setLocation: (state, action) => {
      state.currentLocation = action.payload;
    }
  }
});
```

### API Integration
```typescript
import { createApi } from '@tallimantra/sdk/api';

export const weatherApi = createApi({
  baseUrl: 'https://api.weather.com',
  endpoints: {
    getForecast: {
      method: 'GET',
      path: '/forecast/:location',
      auth: true
    }
  }
});
```

### Event Handling
```typescript
export class NotificationPlugin implements Plugin {
  async onEvent(event: PluginEvent) {
    switch (event.type) {
      case 'message:new':
        await this.handleNewMessage(event.data);
        break;
      case 'user:status':
        await this.handleUserStatus(event.data);
        break;
    }
  }
}
```

## Testing Examples

### Unit Tests
```typescript
import { createPluginTestHarness } from '@tallimantra/sdk/testing';

describe('WeatherPlugin', () => {
  let harness;
  
  beforeEach(() => {
    harness = createPluginTestHarness(WeatherPlugin);
  });

  it('should handle weather command', async () => {
    const result = await harness.executeCommand('weather', ['London']);
    expect(result).toContain('Temperature');
  });
});
```

### Integration Tests
```typescript
import { createPluginIntegrationTest } from '@tallimantra/sdk/testing';

describe('WeatherPlugin Integration', () => {
  it('should integrate with chat', async () => {
    const { chat, plugin } = await createPluginIntegrationTest(WeatherPlugin);
    await chat.sendMessage('/weather London');
    expect(chat.lastMessage).toContain('Weather in London');
  });
});
```

## Deployment Example

### Plugin Package Script
```json
{
  "scripts": {
    "build": "tallimantra-plugin build",
    "package": "tallimantra-plugin package",
    "publish": "tallimantra-plugin publish"
  }
}
```

### GitHub Actions Workflow
```yaml
name: Plugin CI/CD
on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - run: npm run package
      - run: npm run publish
```