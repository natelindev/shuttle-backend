import mongoose, { Schema } from 'mongoose';
import getModelList from './modelScanner';
import consts from './consts';
import getModel, { modelParser, evalueateProperty } from './modelBuilder';
import rng from './randomGenerator';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

describe('modelBuilder', () => {
  describe('evalueateProperty', () => {
    it('should work with all basic types', () => {
      const types = consts.modelBuilder.supportedTypes;
      types.forEach(type => {
        let property = type;
        if (type === 'Id') {
          property = 'ObjectId';
        }
        const output = evalueateProperty(type);
        expect(output).toEqual({ type: global[property] });
      });
    });

    it('should fail on invalid types', () => {
      const input = rng(consts.rngOption.string, 10);
      const output = evalueateProperty(input);
      expect(output).toEqual(null);
    });
  });

  describe('modelParser', () => {
    it('should work with a simple model string', async () => {
      const testModel = {
        [consts.property.owner]: true,
        name: 'String!',
        quantity: 'Number'
      };
      const resultModel = modelParser('testModel', testModel);
      // is a mongoose model
      expect(resultModel).toBe(true);
      // have owner
      expect(
        Object.prototype.hasOwnProperty.call(resultModel, 'owner')
      ).toBeTruthy();
    });
  });
  describe('getModel', () => {
    it('should return a mongoose model', async () => {
      const modelList = await getModelList();
      logger.info(modelList);
      const models = await Promise.all(
        modelList.map(async modelName => getModel(modelName))
      );
      logger.info(models);
      expect(models.every(model => model instanceof mongoose.model)).toBe(true);
    });
  });
});
