import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default class TestDBManager {
  server: MongoMemoryServer;
  connection: any;

  constructor() {
    this.server = new MongoMemoryServer();
    this.connection = null;
  }

  async start() {
    const mongoUri = await this.server.getConnectionString();
    const mongooseOptions = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true
    };
    this.connection = await mongoose.connect(mongoUri, mongooseOptions, err => {
      if (err) logger.error(err);
    });
  }

  stop() {
    return this.server.stop();
  }
}
