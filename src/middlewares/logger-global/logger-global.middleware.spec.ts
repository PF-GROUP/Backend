import { LoggerGlobalMiddleware } from './logger-global.middleware';

describe('LoggerGlobalMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerGlobalMiddleware()).toBeDefined();
  });
});
