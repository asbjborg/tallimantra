import { EventBus } from '../eventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should emit and receive sync events', () => {
    const mockFn = jest.fn();
    eventBus.on('test', mockFn);
    eventBus.emit('test', 'data');
    expect(mockFn).toHaveBeenCalledWith('data');
  });

  it('should emit and receive async events', async () => {
    const mockFn = jest.fn();
    eventBus.onAsync('test', mockFn);
    await eventBus.emitAsync('test', 'data');
    expect(mockFn).toHaveBeenCalledWith('data');
  });

  it('should handle multiple async listeners', async () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    eventBus.onAsync('test', mockFn1);
    eventBus.onAsync('test', mockFn2);
    await eventBus.emitAsync('test', 'data');
    expect(mockFn1).toHaveBeenCalledWith('data');
    expect(mockFn2).toHaveBeenCalledWith('data');
  });
}); 