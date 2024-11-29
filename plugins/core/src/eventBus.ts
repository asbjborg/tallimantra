import EventEmitter from 'eventemitter3';

export class EventBus extends EventEmitter {
  async emit(event: string, ...args: any[]): Promise<void> {
    const listeners = this.listeners(event);
    
    for (const listener of listeners) {
      try {
        const result = listener(...args);
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    }
  }
}

export default new EventBus(); 