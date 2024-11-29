export interface PluginManifest {
  id: string;
  version: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  permissions?: string[];
}

export interface PluginConfig {
  [key: string]: unknown;
}

export interface ExtensionPoint<T = unknown> {
  id: string;
  implementations: Map<string, T>;
}

export interface Plugin {
  manifest: PluginManifest;
  instance: PluginInstance;
  status: PluginStatus;
  config: PluginConfig;
}

export interface PluginInstance {
  onLoad?(): Promise<void>;
  onUnload?(): Promise<void>;
  getConfig?(): PluginConfig;
  setConfig?(config: PluginConfig): Promise<void>;
}

export enum PluginStatus {
  REGISTERED = 'registered',
  LOADING = 'loading',
  ACTIVE = 'active',
  ERROR = 'error',
  DISABLED = 'disabled',
  UNLOADED = 'unloaded'
}

export interface PluginError extends Error {
  pluginId: string;
  code: string;
}

export type EventHandler = (...args: any[]) => void | Promise<void>;

export interface EventBus {
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, ...args: any[]): Promise<void>;
}

export interface PluginAPI {
  // Plugin Lifecycle
  register(manifest: PluginManifest, instance: PluginInstance): void;
  unregister(pluginId: string): void;
  load(pluginId: string): Promise<void>;
  unload(pluginId: string): Promise<void>;
  
  // Configuration
  getConfig(pluginId: string): PluginConfig;
  setConfig(pluginId: string, config: PluginConfig): Promise<void>;
  
  // Extension Points
  defineExtensionPoint<T>(id: string): void;
  implement<T>(pointId: string, implementation: T): void;
  getImplementations<T>(pointId: string): T[];
  
  // Events
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, ...args: any[]): Promise<void>;
  
  // Plugin Info
  getPlugin(pluginId: string): Plugin | undefined;
  listPlugins(): Plugin[];
  getDependents(pluginId: string): string[];
  checkDependencies(manifest: PluginManifest): boolean;
} 