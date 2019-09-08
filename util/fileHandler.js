// import { promisify } from 'util';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import consts from './consts';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const listDir = async (path, option = consts.options.all) => {
  try {
    const files = await fsPromises.readdir(path);
    const dirs = await Promise.all(
      files
        .filter(async file => {
          const result = await fsPromises.stat(join(path, file));
          switch (option) {
            case consts.options.dirs:
              return result.isDirectory();
            case consts.options.files:
              return !result.isDirectory();
            case consts.options.all:
            default:
              return true;
          }
        })
        .map(file => JSON.stringify(file).replace(/"/gm, ''))
    );

    return dirs;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

export default { listDir };
