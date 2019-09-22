import getModelList from './modelScanner';

describe('model Scanner -> getModelList', () => {
  it('should contain all available static models', async () => {
    expect(await getModelList()).toContain(
      'article',
      'comment',
      'dynamicModel',
      'image',
      'link',
      'note',
      'status',
      'tag',
      'user'
    );
  });
});
