import fh from './fileHandler';
import getLogger from './logger';
import consts from './consts';
import dynamicModel from '../model/dynamicModel';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const getModelList = async () => {
  try {
    // get the static list
    let staticModels = await fh.listDir(
      `./${consts.path.model}`,
      consts.option.files
    );
    // remove .js extenstion
    staticModels = staticModels.map(model => model.slice(0, -3));
    // get the dynamic models
    const dynamicModels = await dynamicModel.find({}).select('name -_id');
    // pack up and remove null or undefined
    const allModels = [...staticModels, ...dynamicModels].filter(m => m);
    logger.debug(`Scanned models: ${allModels}`);
    return allModels;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

export default getModelList;
