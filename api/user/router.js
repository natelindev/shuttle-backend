import { Router } from 'express';
import mongoose from 'mongoose';
import User from './model';
import asyncHandler from '../../util/errorHandler';

const router = Router();
/**
 * @api {get} /user
 * @apiName GetUsers
 * @apiDescription Retrieve all Users
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 * @apiSuccess {String} All Users.
 */
router.get(
  '/user',
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (users) {
      res.send(users);
    } else {
      res.status(204).end();
    }
  })
);

/**
 * @api {post} /user
 * @apiName createUser
 * @apiDescription Create a new User
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 * @apiSuccess {String} Location CreatedUserURI
 */
router.post(
  '/user',
  asyncHandler(async (req, res) => {
    const user = await new User(req.body).save();
    res.status(201).send({ Location: `${req.url}/${user._id}` });
  })
);

/**
 * @api {put} /User
 * @apiName updateUsers
 * @apiDescription Bulk update of Users
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 * @apiSuccess (204) Empty
 */
router.put(
  '/user',
  asyncHandler(async (req, res) => {
    const users = req.body;
    const bulkOperation = User.collection.initializeUnorderedBulkOp();
    users.forEach(user => {
      const id = mongoose.Types.ObjectId(user._id);
      bulkOperation.find({ _id: id }).updateOne({
        $set: {
          name: user.name,
          description: user.description,
          quantity: user.quantity
        }
      });
    });
    await bulkOperation.execute();
    res.status(204).end();
  })
);

/**
 *
 * @api {delete} /user
 * @apiName deleteUsers
 * @apiDescription Delete All Users
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 *
 * @apiSuccess (204) Empty
 *
 */
router.delete(
  '/user',
  asyncHandler(async (req, res) => {
    await User.deleteMany({});
    res.status(204).end();
  })
);

/**
 *
 * @api {get} /user/:userId
 * @apiName getUserById
 * @apiDescription Get a User by Id
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} userId The Id of the User
 *
 * @apiSuccess (200) {String} User The requested user
 *
 */
router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });
    if (user) {
      res.send(user);
    } else {
      res.status(404).end();
    }
  })
);

/**
 *
 * @api {put} /user/:userId
 * @apiName updateUserById
 * @apiDescription Update a User by Id
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} userId The Id of the User
 *
 * @apiSuccess (204) Empty
 *
 */
router.put(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body);
    user.save();
    res.status(204).end();
  })
);

/**
 *
 * @api {delete} /user/:userId
 * @apiName deleteUserById
 * @apiDescription Delete a User by Id
 * @apiGroup User
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} userId The Id of the User
 *
 * @apiSuccess (204) Empty
 *
 */
router.delete(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    await User.findByIdAndRemove(req.params.userId);
    res.status(204).end();
  })
);

module.exports = router;
