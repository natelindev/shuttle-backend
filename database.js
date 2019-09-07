import 'dotenv/config';
import mongoose from 'mongoose';
import getLogger from './util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const mongooseOptions = {
  keepAlive: 300000,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

export default {
  connect() {
    mongoose
      .connect(`${process.env.MONGODB_CONNECT_STRING}`, mongooseOptions)
      .then(() => logger.info('MongoDB connected'))
      .catch(err => logger.error(err));
  }
};
