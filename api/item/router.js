import { Router } from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';
import Item from './model';
import consts from '../../util/consts';
import validate from '../../util/apiValidator';
import authorize from '../../util/permisson';
import asyncHandler from '../../util/errorHandler';

const router = Router();

/**
 * @api {get} /item
 * @apiName GetItems
 * @apiDescription Retrieve all Items
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiSuccess {String} All Items.
 */
router.get(
  '/item',
  asyncHandler(async (req, res) => {
    const items = await Item.find({});
    if (items) {
      res.send(items);
    } else {
      res.status(204).end();
    }
  })
);

/**
 * @api {post} /item
 * @apiName createItem
 * @apiDescription Create a new Item
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiSuccess {String} Location CreatedItemURI
 */
router.post(
  '/item',
  authorize([consts.roles.admin]),
  asyncHandler(async (req, res) => {
    const item = await new Item(req.body).save();
    res.status(201).send({ Location: `${req.url}/${item._id}` });
  })
);

/**
 * @api {put} /Item
 * @apiName updateItems
 * @apiDescription Bulk update of Items
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiSuccess (204) Empty
 */
router.put(
  '/item',
  authorize([consts.roles.admin]),
  asyncHandler(async (req, res) => {
    const items = req.body;
    const bulkOperation = Item.collection.initializeUnorderedBulkOp();
    items.forEach(item => {
      const id = mongoose.Types.ObjectId(item._id);
      bulkOperation.find({ _id: id }).updateOne({
        $set: {
          name: item.name,
          description: item.description,
          quantity: item.quantity
        }
      });
    });
    await bulkOperation.execute();
    res.status(204).end();
  })
);

/**
 *
 * @api {delete} /item
 * @apiName deleteItems
 * @apiDescription Delete All Items
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 *
 * @apiSuccess (204) Empty
 *
 */
router.delete(
  '/item',
  authorize([consts.roles.admin]),
  asyncHandler(async (req, res) => {
    await Item.deleteMany({});
    res.status(204).end();
  })
);

/**
 *
 * @api {get} /item/:itemId
 * @apiName getItemById
 * @apiDescription Get an Item by Id
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} itemId The Id of the Item
 *
 * @apiSuccess (200) {String} Item The requested item
 *
 */
router.get(
  '/item/:itemId',
  validate([
    param('itemId')
      .exists()
      .withMessage('id required')
  ]),
  asyncHandler(async (req, res) => {
    const item = await Item.findOne({ _id: req.params.itemId });
    if (item) {
      res.send(item);
    } else {
      res.status(404).end();
    }
  })
);

/**
 *
 * @api {put} /item/:itemId
 * @apiName updateItemById
 * @apiDescription Update an Item by Id
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} itemId The Id of the Item
 *
 * @apiSuccess (204) Empty
 *
 */
router.put(
  '/item/:itemId',
  validate([
    param('itemId')
      .exists()
      .withMessage('id required')
  ]),
  authorize([consts.roles.admin]),
  asyncHandler(async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.itemId, req.body);
    item.save();
    res.status(204).end();
  })
);

/**
 *
 * @api {patch} /item/:itemId
 * @apiName modifyItemById
 * @apiDescription Update an Item by Id
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} itemId The Id of the Item
 *
 * @apiSuccess (204) Empty
 *
 */
router.patch(
  '/item/:itemId',
  validate([
    param('itemId')
      .exists()
      .withMessage('id required')
  ]),
  asyncHandler(async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.itemId, {
      $set: req.body
    });
    item.save();
    res.status(204).end();
  })
);

/**
 *
 * @api {delete} /item/:itemId
 * @apiName deleteItemById
 * @apiDescription Delete an Item by Id
 * @apiGroup Item
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} itemId The Id of the Item
 *
 * @apiSuccess (204) Empty
 *
 */
router.delete(
  '/item/:itemId',
  validate([
    param('itemId')
      .exists()
      .withMessage('id required')
  ]),
  asyncHandler(async (req, res) => {
    await Item.findByIdAndRemove(req.params.itemId);
    res.status(204).end();
  })
);

export default router;
