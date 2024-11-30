import { Plugin } from '../types';
import { eventBus } from '../core/eventBus';
import {
  Registry,
  RegistryPlugin,
  RegistryEvent,
  RegistryState
} from './types';

class PluginRegistry {
  private state: RegistryState;
  private updateInterval?: NodeJS.Timeout;
  private config: {
    registry_url: string;
    update_interval: number;
    cache_ttl: number;
    auto_update: boolean;
  };

  constructor(config: Partial<typeof PluginRegistry.prototype.config> = {}) {
    this.config = {
      registry_url: 'https://registry.tallimantra.com',
      update_interval: 60, // minutes
      cache_ttl: 1440, // minutes
      auto_update: false,
      ...config
    };

    this.state = {
      plugins: new Map(),
      lastUpdated: new Date().toISOString()
    };
  }

  async initialize(): Promise<void> {
    await this.loadRegistry();
    this.startUpdateCheck();
  }

  private async loadRegistry(): Promise<void> {
    try {
      const response = await fetch(this.config.registry_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch registry: ${response.statusText}`);
      }

      const registry = await response.json() as Registry;
      this.updateState(registry);
    } catch (error) {
      console.error('Failed to load registry:', error);
      throw error;
    }
  }

  private updateState(registry: Registry): void {
    // Clear existing plugins
    this.state.plugins.clear();

    // Add new plugins
    for (const plugin of registry.plugins) {
      this.state.plugins.set(plugin.id, plugin);
    }

    this.state.lastUpdated = registry.last_updated;
  }

  private startUpdateCheck(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(
      async () => {
        try {
          await this.checkForUpdates();
        } catch (error) {
          console.error('Failed to check for updates:', error);
        }
      },
      this.config.update_interval * 60 * 1000
    );
  }

  private async checkForUpdates(): Promise<void> {
    const response = await fetch(this.config.registry_url);
    if (!response.ok) return;

    const registry = await response.json() as Registry;
    const updates = this.findUpdates(registry);

    for (const update of updates) {
      await eventBus.emitAsync('plugin:update-available', update);
      if (this.config.auto_update) {
        await this.updatePlugin(update);
      }
    }
  }

  private findUpdates(registry: Registry): RegistryPlugin[] {
    return registry.plugins.filter(newPlugin => {
      const currentPlugin = this.state.plugins.get(newPlugin.id);
      return currentPlugin && currentPlugin.version !== newPlugin.version;
    });
  }

  private async updatePlugin(plugin: RegistryPlugin): Promise<void> {
    try {
      // Emit update started event
      await eventBus.emitAsync('plugin:update-started', {
        type: 'plugin:updated',
        plugin,
        timestamp: Date.now()
      } as RegistryEvent);

      // TODO: Implement actual plugin update logic
      this.state.plugins.set(plugin.id, plugin);

      // Emit update completed event
      await eventBus.emitAsync('plugin:update-completed', {
        type: 'plugin:updated',
        plugin,
        timestamp: Date.now()
      } as RegistryEvent);
    } catch (error) {
      // Emit update failed event
      await eventBus.emitAsync('plugin:update-failed', {
        type: 'plugin:updated',
        plugin,
        timestamp: Date.now(),
        error
      });
      throw error;
    }
  }

  getPlugin(id: string): RegistryPlugin | undefined {
    return this.state.plugins.get(id);
  }

  getAllPlugins(): RegistryPlugin[] {
    return Array.from(this.state.plugins.values());
  }

  cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

const plugin: Plugin = {
  id: '@tallimantra/registry',
  name: '@tallimantra/registry',
  version: '0.1.0',
  description: 'Plugin registry and management',
  author: 'asbjborg',
  dependencies: {
    '@tallimantra/core': '^0.1.0'
  },

  async initialize() {
    console.log('Registry plugin initializing...');
    const registry = new PluginRegistry();
    await registry.initialize();

    // Handle cleanup on deactivation
    eventBus.on('plugin:deactivate', () => {
      registry.cleanup();
    });
  },

  async activate() {
    console.log('Registry plugin activated!');
  },

  async deactivate() {
    console.log('Registry plugin deactivated.');
    await eventBus.emitAsync('plugin:deactivate');
  }
};

export default plugin; 