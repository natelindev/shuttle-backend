/**
 * ModelBuilder target for mongoose model
 */

import mongoose, { Schema, model } from 'mongoose';
import { ShuttleModelWrapper } from '../builtinModels/shuttle';
import importHandler from '../util/importHandler';
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
    type supportedTypes = 'String' | 'Number' | 'Date' | 'Boolean' | 'ObjectId';
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

export const build = (input: ShuttleModelWrapper | mongoose.Model<any>): mongoose.Model<any> | null => {
  let result: mongoose.Model<any> | null = null;
  try {
    if (input instanceof ShuttleModelWrapper) {
      // shuttle models

      // access
      const coreSchema = {
        required: true,
        type: String,
        enum: Object.values(access)
      } as any;

      // owner
      if (input.owner) {
        coreSchema.owner = { type: Schema.Types.ObjectId, ref: 'User' };
      }

      // everything else
      Object.entries(input.model).forEach(([key, value]) => {
        coreSchema[key] = parseProperty(value as string | string[]);
      });

      result = model(input.name, new Schema(coreSchema, { timestamps: true, collection: input.name }));
    } else if (input instanceof mongoose.Model) {
      result = input;
    } else {
      logger.error(`Unsupported model dectected: ${input}`);
    }
  } catch (err) {
    logger.error(err);
  }
  return result;
};

export default async (modelName: string): Promise<mongoose.Model<any> | null> => {
  const imported: any = await importHandler.importOne(modelName);
  return build(imported);
};
