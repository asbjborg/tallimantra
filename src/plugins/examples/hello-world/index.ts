import { Plugin } from '../../types';

const plugin: Plugin = {
  id: 'hello-world',
  name: 'Hello World Plugin',
  version: '1.0.0',
  description: 'A simple hello world plugin example',
  author: 'Teddy',

  async initialize() {
    console.log('Hello World plugin initializing...');
  },

  async activate() {
    console.log('Hello World plugin activated!');
  },

  async deactivate() {
    console.log('Hello World plugin deactivated.');
  }
};

export default plugin; 