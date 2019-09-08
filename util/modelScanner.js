import fh from './fileHandler';
import getLogger from './logger';
import consts from './consts';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const getModelList = async () => {
  try {
    const models = await fh.listDir('model', consts.options.files);
    logger.debug(`Scanned models: ${models}`);
    // remove .js
    return models.map(model => model.slice(0, -3));
  } catch (err) {
    logger.error(err);
    return [];
  }
};

export default getModelList;
