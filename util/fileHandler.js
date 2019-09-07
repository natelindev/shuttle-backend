// import { promisify } from 'util';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const listDir = async path => {
  try {
    const files = await fsPromises.readdir(path);
    const dirs = await Promise.all(
      files
        .filter(async file => {
          const result = await fsPromises.stat(join(path, file));
          return result.isDirectory();
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
