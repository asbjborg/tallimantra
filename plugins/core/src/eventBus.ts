import EventEmitter from 'eventemitter3';

type AsyncListener = (...args: any[]) => Promise<void> | void;
type EventType = string | symbol;

export class EventBus extends EventEmitter {
  private asyncListeners: Map<EventType, AsyncListener[]> = new Map();

  on<T extends EventType>(event: T, fn: (...args: any[]) => void, context?: any): this {
    return super.on(event, fn, context);
  }

  off<T extends EventType>(event: T, fn?: ((...args: any[]) => void), context?: any, once?: boolean): this {
    return super.off(event, fn, context, once);
  }

  emit<T extends EventType>(event: T, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  onAsync(event: EventType, listener: AsyncListener): void {
    const listeners = this.asyncListeners.get(event) || [];
    listeners.push(listener);
    this.asyncListeners.set(event, listeners);
  }

  offAsync(event: EventType, listener: AsyncListener): void {
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

  async emitAsync(event: EventType, ...args: any[]): Promise<void> {
    const listeners = this.asyncListeners.get(event) || [];
    await Promise.all(
      listeners.map(async (listener) => {
        try {
          await listener(...args);
        } catch (error) {
          console.error(`Error in async event listener for ${String(event)}:`, error);
        }
      })
    );
  }
}

export default new EventBus(); 