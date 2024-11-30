# Architecture

## Core Philosophy: Everything is a Plugin

Tallimantra follows a radical "everything is a plugin" architecture. This means that even core functionalities are implemented as plugins, making the system extremely modular and flexible. This approach allows for:

1. **Maximum Flexibility**: Every component can be replaced or modified
2. **Consistent Development Pattern**: All features follow the same plugin architecture
3. **Scalable Deployment Options**: From single-user setups to enterprise deployments

## Project Structure

```text
tallimantra/
├── src/                # Core application source
├── plugins/            # Plugin system
│   ├── core/          # Core plugin (plugin system itself)
│   ├── ui-base/       # Base UI components
│   └── [plugin]/      # Additional plugins
├── docs/              # Documentation
│   ├── core/          # Core documentation
│   ├── development/   # Development guides
│   ├── implementation/# Implementation details
│   └── 3rd-party-docs/# External documentation
└── utilities/         # Standalone tools
    └── firecrawl/     # Documentation crawler
```

## Base Plugins

### Core Plugin (`@tallimantra/core`)

- Plugin system foundation
- Event bus
- Plugin lifecycle management
- Basic configuration system
- Inter-plugin communication

### UI Base Plugin (`@tallimantra/ui-base`)

- Basic chat interface
- Theme system
- Layout management
- UI extension points for other plugins

### Message Processor Plugin (`@tallimantra/message-processor`)

- Message pipeline management
- Message transformation hooks
- Message routing
- Message history management

### Storage Plugin (`@tallimantra/storage`)

- Basic file/memory storage
- Plugin state persistence
- Message history storage
- Configuration storage

### Optional Base Plugins

#### Authentication Plugin (`@tallimantra/auth`)

- User management
- Authentication methods
- Permission system
- Session management
- Can be omitted for single-user deployments

#### API Plugin (`@tallimantra/api`)

- External API access
- API key management
- Rate limiting
- API documentation

#### Monitoring Plugin (`@tallimantra/monitoring`)

- System health checks
- Performance metrics
- Usage statistics
- Error tracking

## Plugin System

### Plugin Interface

```typescript
interface Plugin {
  id: string;
  version: string;
  dependencies?: {
    [pluginId: string]: string; // semver
  };
  
  // Lifecycle
  onLoad(): Promise<void>;
  onUnload(): Promise<void>;
  
  // Configuration
  getConfig(): Record<string, any>;
  setConfig(config: Record<string, any>): Promise<void>;
  
  // Event Handling
  on(event: string, handler: Function): void;
  emit(event: string, data: any): void;
  
  // Extension Points
  getExtensionPoints(): string[];
  extend(point: string, implementation: any): void;
}
```

### Plugin Lifecycle

1. **Discovery**: System finds plugin in designated directories
2. **Dependency Check**: Validates all required plugins are available
3. **Configuration Load**: Loads plugin-specific configuration
4. **Initialization**: Calls `onLoad()` in dependency order
5. **Runtime**: Plugin is active and processing events
6. **Shutdown**: Calls `onUnload()` in reverse dependency order

### Inter-Plugin Communication

Plugins can communicate through:

1. **Events**: Pub/sub system for loose coupling
2. **Extension Points**: Direct feature extension
3. **Service Registry**: Shared capabilities

## Deployment Scenarios

### Single User (Minimal)

Required plugins:

- `@tallimantra/core`
- `@tallimantra/ui-base`
- `@tallimantra/message-processor`
- `@tallimantra/storage`

### Multi-User (Standard)

Adds:

- `@tallimantra/auth`
- `@tallimantra/api`

### Enterprise/SaaS (Full)

Adds:

- `@tallimantra/monitoring`
- Custom enterprise plugins

## Security Considerations

1. **Plugin Isolation**: Each plugin runs in its own context
2. **Permission System**: Plugins must declare required permissions
3. **Resource Limits**: System enforces CPU/memory limits per plugin
4. **Data Access**: Plugins can only access authorized data

## Performance

1. **Lazy Loading**: Plugins load only when needed
2. **Resource Management**: System monitors and optimizes plugin resource usage
3. **Caching**: Built-in caching system for plugin data
4. **Scale Out**: Support for distributed plugin deployment

## Future Considerations

1. **Plugin Marketplace**: Central repository for community plugins
2. **Hot Reload**: Update plugins without restart
3. **Plugin Analytics**: Usage and performance tracking
4. **Cross-Instance Communication**: Plugin coordination across deployments

## Utilities

Tallimantra includes standalone utilities that support the main application but operate independently:

### Documentation Crawler (Firecrawl)

- Crawls external documentation
- Converts to markdown format
- Adds YAML frontmatter
- Organizes by source/domain
- Used to maintain 3rd-party-docs

## Documentation System

### Structure

1. **Core Documentation**
   - Architecture
   - Development guides
   - Implementation details

2. **Plugin Documentation**
   - Each plugin maintains its own docs
   - Standard README format
   - Usage examples

3. **External Documentation**
   - Maintained in `docs/3rd-party-docs/`
   - Crawled from official sources
   - Used for LLM context
   - Version controlled

### Documentation Flow

1. **Internal Docs**
   - Written and maintained manually
   - Follow standard markdown format
   - Include code examples

2. **External Docs**
   - Crawled using Firecrawl utility
   - Automatically formatted
   - Regular updates via crawling
   - Version tracked
