import { promises as fs } from 'fs';
import * as path from 'path';
import { Plugin, PluginManifest, LoadedPlugin, PluginLoadError, PluginHookResult } from './types';

export class PluginLoader {
  private plugins: Map<string, LoadedPlugin> = new Map();
  private pluginDir: string;

  constructor(pluginDir: string) {
    this.pluginDir = pluginDir;
  }

  async discoverPlugins(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.pluginDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(dir => path.join(this.pluginDir, dir.name));
    } catch (error) {
      console.error('Failed to discover plugins:', error);
      return [];
    }
  }

  async loadPlugin(pluginPath: string): Promise<PluginHookResult> {
    try {
      const manifestPath = path.join(pluginPath, 'package.json');
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent) as PluginManifest;

      if (!this.validateManifest(manifest)) {
        throw new Error(`Invalid plugin manifest for ${manifest.name}`);
      }

      const mainPath = path.join(pluginPath, manifest.main);
      const pluginModule = await import(mainPath);
      const plugin: Plugin = pluginModule.default;

      if (!this.validatePlugin(plugin)) {
        throw new Error(`Invalid plugin implementation for ${manifest.name}`);
      }

      const loadedPlugin: LoadedPlugin = {
        ...plugin,
        manifest,
        enabled: false,
        path: pluginPath,
      };

      this.plugins.set(plugin.id, loadedPlugin);
      return { success: true };
    } catch (error) {
      const pluginError: PluginLoadError = {
        pluginId: path.basename(pluginPath),
        error: error as Error,
        type: 'load',
      };
      return { success: false, error: pluginError };
    }
  }

  private validateManifest(manifest: PluginManifest): boolean {
    return !!(
      manifest.id &&
      manifest.name &&
      manifest.version &&
      manifest.main
    );
  }

  private validatePlugin(plugin: Plugin): boolean {
    return !!(
      plugin.id &&
      plugin.name &&
      plugin.version
    );
  }

  async initializePlugin(pluginId: string): Promise<PluginHookResult> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return {
        success: false,
        error: {
          pluginId,
          error: new Error('Plugin not found'),
          type: 'initialize',
        },
      };
    }

    try {
      if (plugin.initialize) {
        await plugin.initialize();
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          pluginId,
          error: error as Error,
          type: 'initialize',
        },
      };
    }
  }

  async activatePlugin(pluginId: string): Promise<PluginHookResult> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return {
        success: false,
        error: {
          pluginId,
          error: new Error('Plugin not found'),
          type: 'activate',
        },
      };
    }

    try {
      if (plugin.activate) {
        await plugin.activate();
      }
      plugin.enabled = true;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          pluginId,
          error: error as Error,
          type: 'activate',
        },
      };
    }
  }

  async deactivatePlugin(pluginId: string): Promise<PluginHookResult> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return {
        success: false,
        error: {
          pluginId,
          error: new Error('Plugin not found'),
          type: 'deactivate',
        },
      };
    }

    try {
      if (plugin.deactivate) {
        await plugin.deactivate();
      }
      plugin.enabled = false;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          pluginId,
          error: error as Error,
          type: 'deactivate',
        },
      };
    }
  }

  getPlugin(pluginId: string): LoadedPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.plugins.values());
  }
} 