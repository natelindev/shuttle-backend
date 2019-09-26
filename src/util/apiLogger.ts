import getLogger from './logger';
import { colors } from './consts';

const logger = getLogger('api');

export default (req: any, res: any, next: any) => {
  res.on('finish', () => {
    logger.info(`${req.method} ${colors.FgCyan}${req.originalUrl} ${colors.FgYellow}${res.statusCode}`);
  });
  next();
};
