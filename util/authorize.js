import passport from 'passport';
import consts from './consts';
import getLogger from './logger';
import asyncHandler from './errorHandler';
import getModelList from './modelScanner';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default roles =>
  asyncHandler(async (req, res, next) => {
    logger.info('custom auth begin');
    let statusCode = 403;
    logger.info(req.user);
    if (!roles || roles.length < 1 || roles.includes(consts.roles.user)) {
      // user level authorize
      if (req && req.user) {
        next();
      }
      statusCode = 401;
    }
    if (roles && roles.includes(consts.roles.owner)) {
      // owner level authorize
      if (req.user) {
        // get item type
        const itemType = Object.keys(req.params)
          .find(key => key.includes('Id'))
          .replace('Id', '');
        const itemId = req.params[`${itemType}Id`];
        // dynamic import of the Item
        const modelList = await getModelList();
        if (itemType && itemId && modelList.includes(itemType)) {
          try {
            const Item = await import(`${consts.paths.model}${itemType}`);
            const item = await Item.default.findOne({ _id: itemId });
            // if it does not have auhtor field, user should not have access to it.
            if (item.author && item.author === req.user._id) {
              next();
            }
          } catch (err) {
            logger.error(err);
          }
        } else {
          logger.warning(
            `Unkown item type ${itemType} when checking ownership.`
          );
        }
      }
    }
    // admin will always have priviledge
    if (req && req.user && req.user.roles === consts.roles.admin) {
      next();
    }
    res.status(statusCode);
  });
