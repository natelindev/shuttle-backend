import 'dotenv/config';
import mongoose from 'mongoose';
import getLogger from './util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const mongooseOptions: mongoose.ConnectionOptions = {
  connectTimeoutMS: 30000,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

export default {
  connect(): void {
    mongoose
      .connect(`${process.env.MONGODB_CONNECT_STRING}`, mongooseOptions)
      .then(() => logger.info('MongoDB connected'))
      .catch((err: any) => logger.error(err));
  }
};
