/**
 * ModelBuilder target for mongoose model
 */

import mongoose, { Schema, model } from 'mongoose';
import { ShuttleModel, modelTypes } from '../types/shuttleModel';
import getLogger from '../util/logger';
import { access } from '../util/consts';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export const shuttleConsts = {
  // (ref.)type(:default)(!)
  regex: /^(?<ref>[a-zA-Z]+\.)?((?<type>[a-zA-Z]+))(:(?<default>.+))?(?<required>!)?$/,
  supportedTypes: ['String', 'Number', 'Date', 'Boolean', 'Id']
};

export const parseProperty = (value: string | string[]): any => {
  // change this into recursive type when typescript 3.7 relases

  // recursive array mapping
  if (Array.isArray(value)) {
    return value.map(v => parseProperty(v));
  }
  // schema string parsing
  const result = shuttleConsts.regex.exec(value);
  if (!result) {
    logger.error(`Invalid property: ${value}`);
    return null;
  }

  if (shuttleConsts.supportedTypes.includes(result.groups.type)) {
    const schemaItem = {} as any;
    if (result.groups.type === 'Id') {
      // ObjectId
      result.groups.type = 'ObjectId';
    }

    // find the according type
    type supportedTypes = 'String' | 'Number' | 'Date' | 'Boolean' | 'ObjectId';
    schemaItem.type = Schema.Types[result.groups.type as supportedTypes];

    // ref can only be used on ObjectId
    if (result.groups.ref && result.groups.type === 'ObjectId') {
      schemaItem.ref = result.groups.ref;
    } else if (result.groups.ref) {
      logger.error(`Invalid ref on property ${result.groups.type} detected`);
    }
    if (result.groups.required) {
      schemaItem.required = true;
    }
    if (result.groups.default) {
      schemaItem.default = !!result.groups.default;
    }
    return schemaItem;
  }
  logger.error(`Unkown property type: ${result.groups.type}`);
  return null;
};

export default (input: ShuttleModel): mongoose.Model<any> => {
  let result: mongoose.Model<any> | null;
  try {
    if (input.type === modelTypes.shuttle) {
      // from shuttle to mongoose model

      // access
      const coreObj = {
        required: true,
        type: String,
        enum: Object.values(access)
      } as any;

      // owner
      if (input.owner) {
        coreObj.owner = { type: Schema.Types.ObjectId, ref: 'User' };
      }

      Object.entries(input.model).forEach(([key, value]) => {
        coreObj[key] = parseProperty(value);
      });

      result = model(input.name, new Schema(coreObj, { timestamps: true, collection: input.name }));
    } else if (input.type === modelTypes.mongooseSchema) {
      // from mongooseSchema to mongoose model
      const schema = new mongoose.Schema(input.model);
      if (schema instanceof mongoose.Schema) {
        result = mongoose.model(input.name, schema);
      } else {
        logger.error(`schema building failed for ${input.name}`);
      }
    }
  } catch (err) {
    logger.error(err);
  }
  return result;
};
