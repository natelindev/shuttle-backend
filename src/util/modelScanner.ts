import fh from './fileHandler';
import getLogger from './logger';
import { path, fileOptions } from './consts';
import dynamicModel from '../model/dynamicModel';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

/**
 * Scan the model path and return a list of models as string array
 */
const getModelList = async (): Promise<string[]> => {
  let result: string[];
  try {
    // Static models
    let staticModels = await fh.listDir(`./${path.model}`, fileOptions.files);
    // remove .ts extenstion
    staticModels = staticModels.map(model => model.slice(0, -3));
    logger.debug(`Scanned static models: ${staticModels}`);
    result = staticModels;

    // Dynamic models
    const selectedModels = await dynamicModel.find({}).select('name -_id');
    const dynamicModels = selectedModels.map(model => model.name);

    // pack up and remove falsy values
    logger.debug(`Scanned dynamic models: ${dynamicModels}`);
    result = [...staticModels, ...dynamicModels].filter(m => m);
  } catch (err) {
    logger.error(err);
  }
  return result;
};

export default getModelList;
