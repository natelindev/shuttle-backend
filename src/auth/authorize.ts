/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import getLogger from '../util/logger';
import asyncHandler from '../util/errorHandler';
import getModelList from '../util/modelScanner';
import importHandler from '../util/importHandler';
import { path } from '../util/consts';
import { AccessInterface, accessType } from '../builtinModels/access';
import User, { roles } from '../builtinModels/user';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default (modelAccess: AccessInterface, requiredAccess: accessType): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authorize begin');
    logger.info(`required access ${requiredAccess}`);
    let statusCode = 403;
    let authorized = false;

    const accessMap: { [key in accessType]: number } = {
      [accessType.noAccess]: 0,
      [accessType.readOnly]: 1,
      [accessType.readWrite]: 2,
      [accessType.fullAccess]: 3
    };

    // auth not needed
    if (accessMap[modelAccess.everyone] >= accessMap[accessType.readOnly]) {
      next();
      authorized = true;
    } else {
      // jwt auth
      try {
        await new Promise<void>((resolve): void => {
          passport.authenticate('jwt', { session: false })(req, res, resolve);
        });
      } catch (err) {
        logger.warn(`Failed auth attempt: ${err}`);
      }

      // current logged in user
      const authUser = await User.findOne({ username: req.user.username });

      if (authUser) {
        // setup user for next middleware use
        req.user.id = authUser._id;
        req.user.role = authUser.role;

        // admin will always have access
        if (authUser.role === roles.admin) {
          next();
          authorized = true;
        }

        // need to check ownership
        if (authUser.role === roles.user || authUser.role === roles.groupOwner) {
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
              if (
                authUser.role === roles.groupOwner &&
                accessMap[modelAccess.groupOwner] >= accessMap[requiredAccess]
              ) {
                const Group = await importHandler.importOne('../builtinModel/userGroup');
                const targetGroup = await Group.findOne({ owner: item.owner });
                // item owner
                if (targetGroup && targetGroup.owner === authUser._id) {
                  next();
                  authorized = true;
                } else {
                  logger.error(`Unexpected condition when checking ${itemType}'s ownership.`);
                }
              }

              // self access check
              if (
                authUser.role === roles.user &&
                accessMap[modelAccess.self] >= accessMap[requiredAccess] &&
                item &&
                item.owner &&
                item.owner.equals(authUser._id)
              ) {
                next();
                authorized = true;
              }
            } catch (err) {
              logger.error(err);
            }
          } else {
            logger.warn(`Unkown item type ${itemType} when checking ownership.`);
          }
        }
      } else {
        statusCode = 401;
      }
    }

    if (!authorized) {
      res.status(statusCode).send(statusCode === 401 ? 'Unauthorized' : 'Forbidden');
    }
  });
