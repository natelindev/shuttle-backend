import getModelList from './modelScanner';
import TestDBManager from './testDBManager';

const testDB = new TestDBManager();
beforeAll(() => testDB.start());
afterAll(() => testDB.stop());

describe('modelScanner', () => {
  describe('getModelList', () => {
    it('should contain all available static models', async () => {
      expect(await getModelList()).toContain([
        'article',
        'comment',
        'dynamicModel',
        'image',
        'link',
        'note',
        'status',
        'tag',
        'user'
      ]);
    });
  });
});
