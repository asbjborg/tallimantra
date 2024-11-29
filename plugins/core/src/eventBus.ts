import EventEmitter from 'eventemitter3';

export class EventBus extends EventEmitter {
  emitAsync(event: string, ...args: any[]): Promise<void> {
    const listeners = this.listeners(event);
    
    return Promise.all(
      listeners.map(async (listener) => {
        try {
          const result = listener(...args);
          if (result && typeof result.then === 'function') {
            await result;
          }
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      })
    ).then(() => {});
  }
}

export default new EventBus(); 