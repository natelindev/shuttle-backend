/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import getLogger from './logger';
import asyncHandler from './errorHandler';
import getModelList from './modelScanner';
import importHandler from './importHandler';
import { path, access } from './consts';
import User, { roles } from '../builtinModels/user';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default (requiredAccess: access): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info('custom auth begin');
    logger.info(`required access ${requiredAccess}`);
    let statusCode = 403;
    let authorized = false;

    // current logged in user
    const authUser = await User.findOne({ username: req.user.username });

    // no need to check permisson
    if (requiredAccess === access.public) {
      next();
      authorized = true;
    }

    if (authUser) {
      // setup user for next middleware use
      req.user.id = authUser._id;
      req.user.role = authUser.role;

      // admin will always have access
      if (authUser.role === roles.admin || requiredAccess === access.everyone) {
        next();
        authorized = true;
      }

      // need to check ownership
      if (requiredAccess === access.group || requiredAccess === access.private) {
        // get item type
        const itemType = Object.keys(req.params)
          .find(key => key.includes('Id'))
          .replace('Id', '');
        const itemId = req.params[`${itemType}Id`];
        // dynamic import of the Item
        const modelList = await getModelList();
        if (itemType && itemId && modelList.includes(itemType)) {
          try {
            const Item = await importHandler.importOne(`../${path.model}/${itemType}`);
            const item = await Item.findOne({ _id: itemId });

            // groupowner and owner can access
            if (requiredAccess === access.group) {
              const Group = await importHandler.importOne('../builtinModel/userGroup');
              const targetGroup = await Group.findOne({ owner: item.owner });
              if (item && item.owner && item.owner.equals(authUser._id)) {
                next();
                authorized = true;
              } else if (targetGroup && targetGroup.owner === authUser._id) {
                next();
                authorized = true;
              } else {
                logger.error(`Unexpected condition when checking ${itemType}'s ownership.`);
              }
            }
            // only owner can access
            // if it does not have owner field, user should not have access to it.
            if (requiredAccess === access.private && item && item.owner && item.owner.equals(authUser._id)) {
              next();
              authorized = true;
            }
          } catch (err) {
            logger.error(err);
          }
        } else {
          logger.warning(`Unkown item type ${itemType} when checking ownership.`);
        }
      }
    } else {
      statusCode = 401;
    }

    if (!authorized) {
      res.status(statusCode).send(statusCode === 401 ? 'Unauthorized' : 'Forbidden');
    }
  });
