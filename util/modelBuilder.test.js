import mongoose, { Schema } from 'mongoose';
import getModelList from './modelScanner';
import consts from './consts';
import getModel, { modelParser, evalueateProperty } from './modelBuilder';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

describe('model Builder -> evalueateProperty', () => {
  it('should work with all basic types', () => {
    const input = 'String';
    const output = evalueateProperty(input);
    logger.info(
      `${JSON.stringify(output)} === ${JSON.stringify({
        type: Schema.Types.String
      })}`
    );
    logger.info(`${output === { type: Schema.Types.String }}`);
    expect(output).toEqual({ type: Schema.Types.String });
  });
});

describe('model Builder -> modelParser', () => {
  it('should work with a simple model string', async () => {
    const testModel = {
      [consts.property.owner]: true,
      name: 'String!',
      quantity: 'Number'
    };
    const resultModel = modelParser('testModel', testModel);
    // is a mongoose model
    expect(resultModel instanceof mongoose.model).toBeTruthy();
    // do not have owner
    expect(
      !Object.prototype.hasOwnProperty.call(resultModel, 'owner')
    ).toBeTruthy();
  });
});

describe('model Builder -> getModel', () => {
  it('should return a mongoose model', async () => {
    const modelList = await getModelList();
    logger.info(modelList);
    const models = await Promise.all(
      modelList.map(async modelName => getModel(modelName))
    );
    logger.info(models);
    expect(models.every(model => model instanceof mongoose.model)).toBeTruthy();
  });
});
