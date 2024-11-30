import { jest } from '@jest/globals';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PluginLoader } from '../loader';
import { Plugin, PluginManifest } from '../types';

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}));

const mockPlugin: Plugin = {
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  initialize: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
};

const mockManifest: PluginManifest = {
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  main: 'index.js',
};

describe('PluginLoader', () => {
  let loader: PluginLoader;
  const mockPluginDir = '/mock/plugins';

  beforeEach(() => {
    loader = new PluginLoader(mockPluginDir);
    jest.clearAllMocks();
  });

  describe('discoverPlugins', () => {
    it('should discover plugin directories', async () => {
      const mockEntries = [
        { name: 'plugin1', isDirectory: () => true },
        { name: 'plugin2', isDirectory: () => true },
        { name: 'not-a-plugin', isDirectory: () => false },
      ];

      (fs.readdir as jest.Mock).mockResolvedValue(mockEntries);

      const plugins = await loader.discoverPlugins();

      expect(plugins).toEqual([
        path.join(mockPluginDir, 'plugin1'),
        path.join(mockPluginDir, 'plugin2'),
      ]);
    });

    it('should handle errors gracefully', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Failed to read'));

      const plugins = await loader.discoverPlugins();

      expect(plugins).toEqual([]);
    });
  });

  describe('loadPlugin', () => {
    const mockPluginPath = '/mock/plugins/test-plugin';

    beforeEach(() => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockManifest));
      jest.mock(path.join(mockPluginPath, 'index.js'), () => ({
        default: mockPlugin,
      }), { virtual: true });
    });

    it('should load a valid plugin', async () => {
      const result = await loader.loadPlugin(mockPluginPath);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      const loadedPlugin = loader.getPlugin('test-plugin');
      expect(loadedPlugin).toBeDefined();
      expect(loadedPlugin?.id).toBe('test-plugin');
      expect(loadedPlugin?.enabled).toBe(false);
    });

    it('should handle invalid manifest', async () => {
      const invalidManifest = { ...mockManifest, id: undefined };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidManifest));

      const result = await loader.loadPlugin(mockPluginPath);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('load');
    });
  });

  describe('plugin lifecycle', () => {
    beforeEach(async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockManifest));
      await loader.loadPlugin('/mock/plugins/test-plugin');
    });

    it('should initialize plugin', async () => {
      const result = await loader.initializePlugin('test-plugin');

      expect(result.success).toBe(true);
      expect(mockPlugin.initialize).toHaveBeenCalled();
    });

    it('should activate plugin', async () => {
      const result = await loader.activatePlugin('test-plugin');

      expect(result.success).toBe(true);
      expect(mockPlugin.activate).toHaveBeenCalled();

      const plugin = loader.getPlugin('test-plugin');
      expect(plugin?.enabled).toBe(true);
    });

    it('should deactivate plugin', async () => {
      await loader.activatePlugin('test-plugin');
      const result = await loader.deactivatePlugin('test-plugin');

      expect(result.success).toBe(true);
      expect(mockPlugin.deactivate).toHaveBeenCalled();

      const plugin = loader.getPlugin('test-plugin');
      expect(plugin?.enabled).toBe(false);
    });

    it('should handle non-existent plugin', async () => {
      const result = await loader.initializePlugin('non-existent');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('initialize');
    });
  });
}); 