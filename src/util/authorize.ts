import consts from './consts';
import getLogger from './logger';
import asyncHandler from './errorHandler';
import getModelList from './modelScanner';
import importHandler from './importHandler';
import User from '../model/user';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default requriedRole =>
  asyncHandler(async (req, res, next) => {
    logger.info('custom auth begin');
    logger.info(`requried role ${requriedRole}`);
    let statusCode = 403;
    let authorized = false;

    const authUser = await User.findOne({ username: req.user.username });

    if (authUser) {
      // setup user for next middleware use
      req.user.id = authUser._id;
      req.user.role = authUser.role;

      if (requriedRole === consts.roles.user) {
        next();
        authorized = true;
      }

      if (requriedRole === consts.roles.owner) {
        // get item type
        const itemType = Object.keys(req.params)
          .find(key => key.includes('Id'))
          .replace('Id', '');
        const itemId = req.params[`${itemType}Id`];
        // dynamic import of the Item
        const modelList = await getModelList();
        if (itemType && itemId && modelList.includes(itemType)) {
          try {
            const Item = await importHandler.importOne(
              `../${consts.path.model}/${itemType}`
            );
            const item = await Item.findOne({ _id: itemId });
            // if it does not have auhtor field, user should not have access to it.
            if (item.author && item.author.equals(authUser._id)) {
              next();
              authorized = true;
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

      // admin will always have access
      if (authUser.role === consts.roles.admin) {
        next();
        authorized = true;
      }
    } else {
      statusCode = 401;
    }

    if (!authorized) {
      res
        .status(statusCode)
        .send(statusCode === 401 ? 'Unauthorized' : 'Forbidden');
    }
  });
