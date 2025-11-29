describe('config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('uses environment variables when set', () => {
    process.env.PORT = '5000';
    process.env.NODE_ENV = 'production';

    const { PORT, NODE_ENV } = require('../src/config/config');

    expect(PORT).toBe(5000);
    expect(NODE_ENV).toBe('production');
  });

  it('falls back to defaults when env vars missing', () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;

    const { PORT, NODE_ENV } = require('../src/config/config');

    expect(PORT).toBe(3003); // adjust default value
    expect(NODE_ENV).toBe('development');
  });
});
