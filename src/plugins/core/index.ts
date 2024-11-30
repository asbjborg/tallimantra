import { Plugin } from '../types';
import { eventBus } from './eventBus';

const plugin: Plugin = {
  id: '@tallimantra/core',
  name: '@tallimantra/core',
  version: '0.1.0',
  description: 'Core functionality for Tallimantra',
  author: 'asbjborg',

  async initialize() {
    // Initialize core functionality
    console.log('Core plugin initializing...');
  },

  async activate() {
    // Expose core functionality to other plugins
    console.log('Core plugin activated!');
    return eventBus;
  },

  async deactivate() {
    // Clean up any listeners or resources
    console.log('Core plugin deactivated.');
  }
};

export default plugin; 