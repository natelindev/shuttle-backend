import mongoose, { Schema } from 'mongoose';
import consts from './consts';
import getModel, { modelParser, evalueateProperty } from './modelBuilder';
import rng from './randomGenerator';
import DynamicModel from '../model/dynamicModel';
import TestDBManager from './testDBManager';

const testDB = new TestDBManager();
beforeAll(() => testDB.start());
afterAll(() => testDB.stop());

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
        expect(output).toEqual({ type: Schema.Types[property] });
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
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
      // have schema
      expect(Object.prototype.hasOwnProperty.call(resultModel, 'schema')).toBe(
        true
      );
      const { paths } = resultModel.schema;
      expect(
        paths.owner.instance === 'ObjectID' &&
          paths.owner.options.ref === 'User'
      ).toBe(true);
      expect(paths.name.instance === 'String' && paths.name.isRequired).toBe(
        true
      );
      expect(paths.quantity.instance === 'Number').toBe(true);
    });
  });

  describe('getModel', () => {
    it('should work with native mongoose model', async () => {
      const resultModel = await getModel('user');
      expect(resultModel !== null).toBe(true);
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
    });

    it('should work with static mongoose model', async () => {
      const resultModel = await getModel('comment');
      expect(resultModel !== null).toBe(true);
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
    });

    it('should work with dynamic mongoose model', async () => {
      await new DynamicModel({
        access: 'public',
        content: {
          [consts.property.owner]: true,
          name: 'String!',
          quantity: 'Number'
        },
        name: 'testModel'
      }).save();
      const resultModel = await getModel('comment');
      expect(resultModel !== null).toBe(true);
      expect(resultModel.prototype instanceof mongoose.Model).toBe(true);
    });
  });
});
