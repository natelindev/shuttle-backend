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

export { modelParser, evalueateProperty };
export default getModel;
