import * as dbModule from '../src/config/database';

describe('database config', () => {
  const OLD_ENV = process.env;
  const originalExit = process.exit;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // mock process.exit so tests don’t stop
    // @ts-ignore
    process.exit = jest.fn() as any;
  });

  afterAll(() => {
    process.env = OLD_ENV;
    process.exit = originalExit;
  });

  it('exports connectMySQL function', () => {
    expect(typeof dbModule.connectMySQL).toBe('function');
  });

  it('does not crash test process when connection fails', async () => {
    // Force bad DB env so connection fails and error path runs
    process.env.DB_HOST = 'invalid-host';
    process.env.DB_USER = 'wrong';
    process.env.DB_PASS = 'wrong';
    process.env.DB_NAME = 'wrong';

    const { connectMySQL } = require('../src/config/database');

    await connectMySQL().catch(() => {
      // ignore rejection if your function rethrows/returns Promise.reject
    });

    // process.exit should have been called instead of actually exiting Jest
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
