import mongoose, { Schema } from 'mongoose';
import rng, { rngOption } from '../util/randomGenerator';
import ShuttleModel, { ShuttleModelWrapper } from '../builtinModels/shuttleModel';
import { TestDBManager } from '../database';
import getModel, { parseProperty, build, shuttleConsts, supportedTypes } from './mongoose';

const testDB = new TestDBManager();
beforeAll(() => testDB.start());
afterAll(() => testDB.stop());

describe('modelBuilder', () => {
  describe('parseProperty', () => {
    it('should work with all basic types', () => {
      const types = shuttleConsts.supportedTypes;
      types.forEach(type => {
        let property = type;
        if (type === 'Id') {
          property = 'ObjectId';
        }
        const output = parseProperty(type);
        expect(output).toEqual({ type: Schema.Types[property as supportedTypes] });
      });
    });

    it('should fail on invalid types', () => {
      const input = rng(rngOption.string, 10);
      const output = parseProperty(input as string);
      expect(output).toEqual(null);
    });
  });

  describe('build', () => {
    it('should work with a simple model string', async () => {
      const testModel = new ShuttleModelWrapper('test', true, {
        name: 'String!',
        quantity: 'Number'
      });
      const resultModel = build(testModel);
      // is a mongoose model
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
      // have schema
      expect(Object.prototype.hasOwnProperty.call(resultModel, 'schema')).toBe(true);
      const { paths } = resultModel.schema as any;
      expect(paths.owner.instance === 'ObjectID' && paths.owner.options.ref === 'User').toBe(true);
      expect(paths.name.instance === 'String' && paths.name.isRequired).toBe(true);
      expect(paths.quantity.instance === 'Number').toBe(true);
    });
  });

  describe('getModel', () => {
    it('should work with native mongoose model', async () => {
      const resultModel = await getModel('user');
      expect(resultModel !== null).toBe(true);
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
    });

    it('should work with shuttle model', async () => {
      const resultModel = await getModel('comment');
      expect(resultModel !== null).toBe(true);
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
    });

    it('should work with dynamic mongoose model', async () => {
      await new ShuttleModel({
        access: 'public',
        hasOwner: true,
        content: {
          name: 'String!',
          quantity: 'Number'
        },
        name: 'testModel'
      }).save();
      const resultModel = await getModel('testModel');
      expect(resultModel !== null).toBe(true);
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
    });
  });
});
