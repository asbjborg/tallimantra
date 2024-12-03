import { jest } from '@jest/globals';
import { promises as fs, Dirent } from 'fs';
import * as path from 'path';
import { PluginLoader } from '../loader';
import { Plugin, PluginManifest } from '../types';

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}));

// Create properly typed mock functions
const mockInitialize = jest.fn<() => Promise<void>>().mockResolvedValue();
const mockActivate = jest.fn<() => Promise<void>>().mockResolvedValue();
const mockDeactivate = jest.fn<() => Promise<void>>().mockResolvedValue();

const mockPlugin: Plugin = {
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  initialize: mockInitialize,
  activate: mockActivate,
  deactivate: mockDeactivate,
};

const mockManifest: PluginManifest = {
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  main: 'index.js',
};

class TestPluginLoader extends PluginLoader {
  protected override async importModule(): Promise<{ default: Plugin }> {
    return { default: mockPlugin };
  }
}

describe('PluginLoader', () => {
  let loader: TestPluginLoader;
  const mockPluginDir = '/mock/plugins';

  beforeEach(() => {
    loader = new TestPluginLoader(mockPluginDir);
    jest.clearAllMocks();
    (fs.readFile as jest.Mock).mockImplementation((_: any) => {
      return Promise.resolve(JSON.stringify(mockManifest));
    });
  });

  describe('discoverPlugins', () => {
    it('should discover plugin directories', async () => {
      const mockEntries = [
        { 
          name: 'plugin1', 
          isDirectory: () => true,
          isFile: () => false,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        } as Dirent,
        { 
          name: 'plugin2', 
          isDirectory: () => true,
          isFile: () => false,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        } as Dirent,
        { 
          name: 'not-a-plugin', 
          isDirectory: () => false,
          isFile: () => true,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        } as Dirent,
      ];

      (fs.readdir as jest.Mock).mockImplementation((_: any) => {
        return Promise.resolve(mockEntries);
      });

      const plugins = await loader.discoverPlugins();

      expect(plugins).toEqual([
        path.join(mockPluginDir, 'plugin1'),
        path.join(mockPluginDir, 'plugin2'),
      ]);
    });

    it('should handle errors gracefully', async () => {
      (fs.readdir as jest.Mock).mockImplementation((_: any) => {
        return Promise.reject(new Error('Failed to read'));
      });

      const plugins = await loader.discoverPlugins();

      expect(plugins).toEqual([]);
    });
  });

  describe('loadPlugin', () => {
    const mockPluginPath = '/mock/plugins/test-plugin';

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
      (fs.readFile as jest.Mock).mockImplementation((_: any) => {
        return Promise.resolve(JSON.stringify(invalidManifest));
      });

      const result = await loader.loadPlugin(mockPluginPath);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('load');
    });
  });

  describe('plugin lifecycle', () => {
    beforeEach(async () => {
      await loader.loadPlugin('/mock/plugins/test-plugin');
    });

    it('should initialize plugin', async () => {
      const result = await loader.initializePlugin('test-plugin');

      expect(result.success).toBe(true);
      expect(mockInitialize).toHaveBeenCalled();
    });

    it('should activate plugin', async () => {
      const result = await loader.activatePlugin('test-plugin');

      expect(result.success).toBe(true);
      expect(mockActivate).toHaveBeenCalled();

      const plugin = loader.getPlugin('test-plugin');
      expect(plugin?.enabled).toBe(true);
    });

    it('should deactivate plugin', async () => {
      await loader.activatePlugin('test-plugin');
      const result = await loader.deactivatePlugin('test-plugin');

      expect(result.success).toBe(true);
      expect(mockDeactivate).toHaveBeenCalled();

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