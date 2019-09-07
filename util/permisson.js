import consts from './consts';
import getLogger from './logger';
import asyncHandler from './errorHandler';
import getApiList from './apiRegister';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default roles =>
  asyncHandler(async (req, res, next) => {
    let statusCode = 403;
    if (!roles || roles.length < 1 || roles.includes(consts.roles.user)) {
      // user level authorize
      if (req.session && req.session.user) {
        next();
      }
      statusCode = 401;
    }
    if (roles && roles.includes(consts.roles.owner)) {
      // owner level authorize
      if (req.session.user) {
        let itemType = null;
        let itemId = null;
        Object.keys(req.params).forEach(key => {
          // extract item from /:itemId
          if (key.includes('Id')) {
            itemId = key;
            itemType = key.replace('Id', '');
          }
        });
        // dynamic import of the Item
        const apiList = getApiList();
        if (itemType && itemId && apiList.includes(itemType)) {
          try {
            const Item = await import(`../api/${itemType}/model`);
            const item = await Item.default.findOne({ _id: itemId });
            if (item.author === req.session.user._id) {
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
    if (roles && roles.includes(consts.roles.admin)) {
      if (req.session.user.roles === consts.roles.admin) {
        next();
      }
    }
    res.status(statusCode);
  });
