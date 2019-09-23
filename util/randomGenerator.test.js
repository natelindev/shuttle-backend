import rng from './randomGenerator';
import consts from './consts';

describe('randomGenerator', () => {
  describe('decimal', () => {
    it('should generate a random decimal', async () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(consts.rngOption.decimal, 100, -100);
        expect(
          typeof result === 'number' && result <= 100 && result >= -100
        ).toBe(true);
      }
    });
  });
  describe('integer', () => {
    it('should generate a random integer', async () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(consts.rngOption.integer, 100, -100);
        expect(
          typeof result === 'number' &&
            result <= 100 &&
            result >= -100 &&
            result % 1 === 0
        ).toBe(true);
      }
    });
  });
  describe('string', () => {
    it('should generate a random string', async () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(consts.rngOption.string, len);
        expect(typeof result === 'string' && result.length === len).toBe(true);
      }
    });
  });
});
