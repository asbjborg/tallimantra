export interface RegistryPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  repository: string;
  path: string;
  tags: string[];
  dependencies: Record<string, string>;
  permissions: string[];
}

export interface Registry {
  schema_version: string;
  last_updated: string;
  plugins: RegistryPlugin[];
}

export interface RegistryEvent {
  type: 'plugin:added' | 'plugin:removed' | 'plugin:updated';
  plugin: RegistryPlugin;
  timestamp: number;
}

export interface RegistryState {
  plugins: Map<string, RegistryPlugin>;
  lastUpdated: string;
} 