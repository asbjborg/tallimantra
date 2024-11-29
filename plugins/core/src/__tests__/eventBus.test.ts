import { EventBus } from '../eventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe('sync events', () => {
    it('should emit and receive sync events', () => {
      const mockFn = jest.fn();
      eventBus.on('test', mockFn);
      eventBus.emit('test', 'data');
      expect(mockFn).toHaveBeenCalledWith('data');
    });

    it('should remove sync event listener', () => {
      const mockFn = jest.fn();
      eventBus.on('test', mockFn);
      eventBus.off('test', mockFn);
      eventBus.emit('test', 'data');
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('async events', () => {
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

    it('should remove async event listener', async () => {
      const mockFn = jest.fn();
      eventBus.onAsync('test', mockFn);
      eventBus.offAsync('test', mockFn);
      await eventBus.emitAsync('test', 'data');
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should handle errors in async listeners', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockFn = jest.fn().mockRejectedValue(new Error('test error'));
      eventBus.onAsync('test', mockFn);
      await eventBus.emitAsync('test', 'data');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in async event listener for test:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should handle empty listener list', async () => {
      await expect(eventBus.emitAsync('test', 'data')).resolves.not.toThrow();
    });

    it('should handle removing non-existent listener', () => {
      const mockFn = jest.fn();
      expect(() => eventBus.offAsync('test', mockFn)).not.toThrow();
    });
  });
}); 