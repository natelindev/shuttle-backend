import getLogger from './logger';
import colors from './color';

const logger = getLogger('api');

export default (req, res, next) => {
  res.on('finish', () => {
    logger.info(
      `${req.method} ${colors.FgCyan}${req.originalUrl} ${colors.FgYellow}${res.statusCode}`
    );
  });

  next();
};
