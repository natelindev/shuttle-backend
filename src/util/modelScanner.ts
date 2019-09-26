import fh from './fileHandler';
import getLogger from './logger';
import consts from './consts';
import dynamicModel from '../model/dynamicModel';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

/**
 * Scan the model path and return a list of models as string array
 */
const getModelList = async () => {
  let result = [];
  try {
    // Static
    let staticModels = await fh.listDir(
      `./${consts.path.model}`,
      consts.option.files
    );
    // remove .js extenstion
    staticModels = staticModels.map(model => model.slice(0, -3));
    logger.debug(`Scanned static models: ${staticModels}`);
    result = staticModels;

    // Dynamic
    const dynamicModels = await dynamicModel.find({}).select('name -_id');
    // pack up and remove null or undefined
    logger.debug(`Scanned dynamic models: ${dynamicModels}`);
    result = [...staticModels, ...dynamicModels].filter(m => m);
  } catch (err) {
    logger.error(err);
  }
  return result;
};

export default getModelList;
