export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: Record<string, string>;
  initialize?: () => Promise<void>;
  activate?: () => Promise<void>;
  deactivate?: () => Promise<void>;
}

export interface PluginManifest extends Omit<Plugin, 'initialize' | 'activate' | 'deactivate'> {
  main: string;
  engines?: {
    node?: string;
    npm?: string;
  };
}

export interface LoadedPlugin extends Plugin {
  manifest: PluginManifest;
  enabled: boolean;
  path: string;
}

export type PluginLoadError = {
  pluginId: string;
  error: Error;
  type: 'load' | 'initialize' | 'activate' | 'deactivate' | 'dependency';
};

export type PluginHookResult = {
  success: boolean;
  error?: PluginLoadError;
}; 