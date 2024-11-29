# Tallimantra

A plugin-based documentation and knowledge management system.

## Features

- 🔌 Plugin Architecture: Everything is a plugin
- 📚 Documentation First: Built for both humans and AI
- 🎯 Type Safety: Written in TypeScript
- 🔄 Event-Driven: Reactive plugin communication
- 🛠 Extensible: Easy to add new features

## Installation

```bash
npm install tallimantra
```

## Quick Start

```typescript
import { Tallimantra } from 'tallimantra';

// Initialize the system
const system = new Tallimantra();

// Load a plugin
await system.loadPlugin('@tallimantra/plugin-name');

// Start the system
await system.start();
```

## Documentation

- [Architecture Guide](docs/guides/architecture.md)
- [Plugin Development](docs/guides/plugin-development.md)
- [Documentation Standards](docs/guides/documentation.md)

## Available Plugins

- **Core**: Plugin system and event bus
- **N8N Webhook**: N8N integration
- **Media Preview**: Media file previews

## Development

### Prerequisites

- Node.js >= 18
- npm >= 9

### Setup

```bash
# Clone the repository
git clone https://github.com/asbjborg/tallimantra.git

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See [LICENSE](LICENSE) for details.

## Version History

### 0.1.0
- Initial release
- Core plugin system
- Event bus implementation
- Basic plugin examples
- Documentation structure