import EventEmitter from 'eventemitter3';

type AsyncListener = (...args: any[]) => Promise<void> | void;

export class EventBus extends EventEmitter {
  private asyncListeners: Map<string, AsyncListener[]> = new Map();

  onAsync(event: string, listener: AsyncListener): void {
    const listeners = this.asyncListeners.get(event) || [];
    listeners.push(listener);
    this.asyncListeners.set(event, listeners);
  }

  offAsync(event: string, listener: AsyncListener): void {
    const listeners = this.asyncListeners.get(event);
    if (!listeners) return;
    
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        this.asyncListeners.delete(event);
      } else {
        this.asyncListeners.set(event, listeners);
      }
    }
  }

  async emitAsync(event: string, ...args: any[]): Promise<void> {
    const listeners = this.asyncListeners.get(event) || [];
    await Promise.all(
      listeners.map(async (listener) => {
        try {
          await listener(...args);
        } catch (error) {
          console.error(`Error in async event listener for ${event}:`, error);
        }
      })
    );
  }
}

export default new EventBus(); 