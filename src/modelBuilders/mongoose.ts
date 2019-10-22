/**
 * ModelBuilder target for mongoose model
 */

import mongoose, { Schema, model } from 'mongoose';
import ShuttleModel, { ShuttleModelWrapper } from '../builtinModels/shuttleModel';
import importHandler from '../util/importHandler';
import getLogger from '../util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export const shuttleConsts = {
  // (ref.)type(:default)(!)
  regex: /^(?<ref>[a-zA-Z]+\.)?((?<type>[a-zA-Z]+))(:(?<default>.+))?(?<required>!)?$/,
  supportedTypes: ['String', 'Number', 'Date', 'Boolean', 'Id']
};

export type supportedTypes = 'String' | 'Number' | 'Date' | 'Boolean' | 'ObjectId';

export const parseProperty = (value: string | string[]): any => {
  // change this into recursive type when typescript 3.7 relases

  // recursive array mapping
  if (Array.isArray(value)) {
    return value.map(v => parseProperty(v));
  }

  // schema string parsing
  const matches = shuttleConsts.regex.exec(value);
  if (!matches) {
    logger.error(`Invalid property: ${value}`);
    return null;
  }

  if (shuttleConsts.supportedTypes.includes(matches.groups.type)) {
    const schemaItem = {} as any;
    if (matches.groups.type === 'Id') {
      // ObjectId
      matches.groups.type = 'ObjectId';
    }

    // find the according type
    schemaItem.type = Schema.Types[matches.groups.type as supportedTypes];

    // ref can only be used on ObjectId
    if (matches.groups.ref && matches.groups.type === 'ObjectId') {
      schemaItem.ref = matches.groups.ref;
    } else if (matches.groups.ref) {
      logger.error(`Invalid ref on property ${matches.groups.type} detected`);
    }
    if (matches.groups.required) {
      schemaItem.required = true;
    }
    if (matches.groups.default) {
      schemaItem.default = !!matches.groups.default;
    }
    return schemaItem;
  }
  logger.error(`Unkown property type: ${matches.groups.type}`);
  return null;
};

export const build = (
  input: ShuttleModelWrapper | mongoose.Model<any>
): mongoose.Model<any> | null => {
  let result: mongoose.Model<any> | null = null;
  try {
    if (input instanceof ShuttleModelWrapper) {
      // shuttle models
      const coreSchema = {} as any;

      // owner
      if (input.hasOwner) {
        coreSchema.owner = { type: Schema.Types.ObjectId, ref: 'User' };
      }

      // everything else
      Object.entries(input.model).forEach(([key, value]) => {
        coreSchema[key] = parseProperty(value as string | string[]);
      });

      result = model(
        input.name,
        new Schema(coreSchema, { timestamps: true, collection: input.name })
      );
    } else if (input.prototype instanceof mongoose.Model) {
      result = input;
    } else {
      logger.error(`Unsupported model dectected: ${input}`);
    }
  } catch (err) {
    logger.error(err);
  }
  return result;
};

const storedModels: { [key: string]: mongoose.Model<any> } = {};

const getACL = async (modelName: string): Promise<string | null> => {
  let result: string | null;
  const found = await ShuttleModel.findOne({ name: modelName });
  if(found.access && )
};

/**
 * getModel
 * return a mongoose model
 */
const getModel = async (modelName: string): Promise<mongoose.Model<any> | null> => {
  let result: mongoose.Model<any> | null;

  if (storedModels[modelName]) {
    result = storedModels[modelName];
  } else {
    const imported: any = await importHandler.importOne(`../model/${modelName}`);

    if (imported) {
      // static
      result = build(imported);
      storedModels[modelName] = result;
    } else {
      // dynamic
      const found = await ShuttleModel.findOne({ name: modelName });

      if (found) {
        result = build(
          new ShuttleModelWrapper(modelName, found.access, found.hasOwner, found.content)
        );
        storedModels[modelName] = result;
      } else {
        logger.error(`Unable to find model ${modelName}`);
        result = null;
      }
    }
  }
  return result;
};

export default { getACL, getModel };
