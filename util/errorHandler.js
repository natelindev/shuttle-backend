import mongoose from 'mongoose';
import getLogger from './logger';

const logger = getLogger('errorHandler');

const asyncHandler = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    logger.error(err);
    let errors = {
      message: 'Internal Sever Error',
      error: err
    };

    if (err instanceof mongoose.Error.ValidationError) {
      errors = {
        message: 'Mongoose Model Validation Error',
        error: err
      };
    }
    if (err instanceof mongoose.mongo.MongoError) {
      errors = {
        message: 'MongDB Error',
        error: err
      };
    }

    res.status(500).json(errors);
  }
};

export default asyncHandler;
