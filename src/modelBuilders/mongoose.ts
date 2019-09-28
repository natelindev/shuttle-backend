/**
 * ModelBuilder target for mongoose model
 */

import mongoose, { Schema, model } from 'mongoose';
import { ShuttleModel, modelTypes } from '../types/shuttleModel';
import getLogger from '../util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export const shuttleConsts = {
  // (ref.)type(:default)(!)
  regex: /^(?<ref>[a-zA-Z]+\.)?((?<type>[a-zA-Z]+))(:(?<default>.+))?(?<required>!)?$/,
  supportedTypes: ['String', 'Number', 'Date', 'Boolean', 'Id']
};

export const evalueateProperty = (value: string | Array) => {
  // recursive array mapping
  if (Array.isArray(value)) {
    return value.map(v => evalueateProperty(v));
  }
  // schema string parsing
  const result = shuttleConsts.regex.exec(value);
  if (!result) {
    logger.error(`Invalid property: ${value}`);
    return null;
  }

  if (shuttleConsts.supportedTypes.includes(result.groups.type)) {
    const schemaItem = {};
    if (result.groups.type === 'Id') {
      // ObjectId
      result.groups.type = 'ObjectId';
    }

    // find the according type
    schemaItem.type = Schema.Types[result.groups.type];

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

// build a mongoose schema
export const modelParser = (modelName, customSchmea) => {
  const coreObj = {};

  // access
  // all entities need acl for security concerns
  coreObj[consts.property.access] = {
    required: true,
    type: String,
    enum: Object.values(consts.access)
  };

  // owner
  if (customSchmea[consts.property.owner]) {
    coreObj.owner = { type: Schema.Types.ObjectId, ref: 'User' };
  }

  // rest of the properties
  Object.entries(customSchmea).forEach(([key, value]) => {
    if (key !== consts.property.access && key !== consts.property.owner) {
      coreObj[key] = evalueateProperty(value);
    }
  });

  return model(modelName, new Schema(coreObj, { timestamps: true }, { collection: modelName }));
};

// import or generate mongoose schema by model Name
const getModel = async modelName => {
  let resultModel = null;
  logger.debug(`checking ${modelName}`);
  try {
    const staticModelList = await getModelList();
    if (staticModelList.includes(modelName)) {
      // static
      const importedModel = await importHandler.importOne(`../${path.model}/${modelName}`);
      if (importedModel instanceof mongoose.model) {
        // already a mongoose model
        resultModel = importedModel;
      } else {
        // build a new one using custom schmea
        resultModel = modelParser(modelName, importedModel);
      }
    } else {
      // dynamic
      const dynamicModel = await DynamicModel.findOne({ name: modelName });
      if (dynamicModel) {
        resultModel = modelParser(modelName, dynamicModel.conponent);
      }
    }
  } catch (err) {
    logger.error(err);
  }

  return resultModel;
};

export default (input: ShuttleModel): mongoose.Model<any> => {
  let result: mongoose.Model<any> | null;
  try {
    if (input.type === modelTypes.shuttle) {
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
