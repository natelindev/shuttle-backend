import express from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';
import validate from '../util/apiValidator';
import authorize from '../util/authorize';
import consts from '../util/consts';
import getLogger from '../util/logger';
import getModelList from '../util/modelScanner';
import asyncHandler from '../util/errorHandler';
import getModel from '../util/modelBuilder';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const getRestRouters = async () => {
  let restRouters = [];
  try {
    // Import the models
    const modelList = await getModelList();
    restRouters = await Promise.all(
      modelList.map(async modelName => {
        const Model = await getModel(modelName);
        let router = null;
        if (Model) {
          router = express.Router();

          router
            .route(`/${modelName}`)
            .get(
              authorize(consts.access.public),
              asyncHandler(async (req, res) => {
                const allModels = await Model.find({});
                if (allModels) {
                  res.send(allModels);
                } else {
                  res.status(204).end();
                }
              })
            )
            .post(
              authorize(consts.access.everyone),
              asyncHandler(async (req, res) => {
                if (req.user.role !== consts.roles.admin) {
                  // only admin can change ownership
                  req.body.author = req.user.id;
                }
                const model = await new Model(req.body).save();
                res.status(201).send({ Location: `${req.url}/${model._id}` });
              })
            )
            .put(
              authorize(consts.access.group),
              asyncHandler(async (req, res) => {
                const allModels = req.body;
                const bulkOperation = Model.collection.initializeUnorderedBulkOp();
                allModels.forEach(model => {
                  const id = mongoose.Types.ObjectId(model._id);
                  bulkOperation.find({ _id: id }).updateOne({
                    $set: model
                  });
                });
                await bulkOperation.execute();
                res.status(204).end();
              })
            )
            .delete(
              authorize(consts.access.group),
              asyncHandler(async (req, res) => {
                await Model.deleteMany({});
                res.status(204).end();
              })
            );

          router
            .route(`/${modelName}/:${modelName}Id`)
            .all(
              validate([
                param(`${modelName}Id`)
                  .matches(/^[a-fA-F0-9]{24}$/)
                  .withMessage(`Invalid ${modelName}Id`)
              ])
            )
            .get(
              authorize(consts.access.public),
              asyncHandler(async (req, res) => {
                const model = await Model.findOne({
                  _id: req.params[`${modelName}Id`]
                });
                if (model) {
                  res.send(model);
                } else {
                  res.status(404).end();
                }
              })
            )
            .put(
              authorize(consts.access.group),
              asyncHandler(async (req, res) => {
                if (req.user.role !== consts.roles.admin) {
                  // only admin can change ownership
                  req.body.author = req.user.id;
                }
                const model = await Model.findByIdAndUpdate(
                  req.params[`${modelName}Id`],
                  req.body
                );
                model.save();
                res.status(204).end();
              })
            )
            .patch(
              authorize(consts.access.group),
              asyncHandler(async (req, res) => {
                if (req.user.role !== consts.roles.admin) {
                  // only admin can change ownership
                  if (Object.prototype.hasOwnProperty.call(req.body, 'owner')) {
                    delete req.body.owner;
                  }
                }
                const model = await Model.findByIdAndUpdate(
                  req.params[`${modelName}Id`],
                  {
                    $set: req.body
                  }
                );
                model.save();
                res.status(204).end();
              })
            )
            .delete(
              authorize(consts.access.group),
              asyncHandler(async (req, res) => {
                await Model.findByIdAndRemove(req.params[`${modelName}Id`]);
                res.status(204).end();
              })
            );

          logger.debug(`Generated rest api for ${modelName}`);
        }
        return router;
      })
    );
  } catch (err) {
    logger.error(err);
  }
  // prevent null from hitting the list;
  return restRouters.filter(router => router);
};

export default getRestRouters;
