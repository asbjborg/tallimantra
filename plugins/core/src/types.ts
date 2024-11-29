import type { EventEmitter } from 'eventemitter3';

export type Plugin = {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  enabled: boolean;
};

export type PluginConfig = {
  [key: string]: any;
};

export type PluginMetadata = {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
};

export type { EventEmitter }; 