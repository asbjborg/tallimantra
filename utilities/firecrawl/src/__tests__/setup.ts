import { jest } from '@jest/globals';

jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
    quit: jest.fn()
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadFile: jest.fn(),
    webContents: {
      openDevTools: jest.fn()
    }
  })),
  ipcMain: {
    handle: jest.fn()
  }
}));

describe('Electron Mock', () => {
  it('should mock electron correctly', () => {
    const electron = require('electron');
    expect(electron.app.whenReady).toBeDefined();
    expect(electron.BrowserWindow).toBeDefined();
    expect(electron.ipcMain.handle).toBeDefined();
  });
}); 