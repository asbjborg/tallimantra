import EventEmitter from 'eventemitter3';
import type { EventBus, EventHandler } from './types';

export class EventBusImpl implements EventBus {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  on(event: string, handler: EventHandler): void {
    this.emitter.on(event, handler);
  }

  off(event: string, handler: EventHandler): void {
    this.emitter.off(event, handler);
  }

  async emit(event: string, ...args: any[]): Promise<void> {
    const listeners = this.emitter.listeners(event);
    
    // Execute handlers sequentially to maintain order
    for (const listener of listeners) {
      try {
        const result = listener(...args);
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
        // Don't throw, continue with other handlers
      }
    }
  }
} 