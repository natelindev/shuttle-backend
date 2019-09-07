import fh from './fileHandler';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const getApiList = async () => {
  try {
    const dirs = await fh.listDir('api');
    logger.debug(`Scanned apis: ${dirs}`);
    return dirs;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

export default getApiList;
