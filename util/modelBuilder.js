import mongoose, { model, Schema } from 'mongoose';
import getModelList from './modelScanner';
import DynamicModel from '../model/dynamicModel';
import importHandler from './importHandler';
import consts from './consts';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

// parse the property literal to build a schema item
const evalueateProperty = value => {
  // recursive array mapping
  if (Array.isArray(value)) {
    return value.map(v => evalueateProperty(v));
  }
  // schema string parsing
  const result = consts.modelBuilder.regex.exec(value);
  if (!result) {
    logger.error(`Invalid property: ${value}`);
    return null;
  }

  if (consts.modelBuilder.supportedTypes.includes(result.groups.type)) {
    const schemaItem = {};
    if (result.groups.type === 'Id') {
      // ObjectId
      result.groups.type = 'ObjectId';
    }

    // find the according type
    schemaItem.type = Schema.Types[result.groups.type];

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
const modelParser = (modelName, customSchmea) => {
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

  return model(
    modelName,
    new Schema(coreObj, { timestamps: true }, { collection: modelName })
  );
};

// import or generate mongoose schema by model Name
const getModel = async modelName => {
  let resultModel = null;
  logger.debug(`checking ${modelName}`);
  try {
    const staticModelList = await getModelList();
    if (staticModelList.includes(modelName)) {
      // static
      const importedModel = await importHandler.importOne(
        `../${consts.path.model}/${modelName}`
      );
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

export { modelParser, evalueateProperty };
export default getModel;
