import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default class TestDBManager {
  server: MongoMemoryServer;

  connection: typeof mongoose | null;

  constructor() {
    this.server = new MongoMemoryServer();
    this.connection = null;
  }

  async start(): Promise<void> {
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

  stop(): Promise<boolean> {
    return this.server.stop();
  }
}
