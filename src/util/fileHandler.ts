// import { promisify } from 'util';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import consts from './consts';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));
const { readdir, stat } = fsPromises;

const listDir = async (path, option = consts.option.all) => {
  try {
    const files = await readdir(path);
    const dirs = await Promise.all(
      files
        .filter(async file => {
          const result = await stat(join(path, file));
          switch (option) {
            case consts.option.dirs:
              return result.isDirectory();
            case consts.option.files:
              return !result.isDirectory();
            case consts.option.all:
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
