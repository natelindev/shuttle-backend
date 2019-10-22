import mongoose, { Schema, model } from 'mongoose';
import getLogger from '../util/logger';

const logger = getLogger('accessControl');

export enum accessType {
  noAccess = 'noAccess',
  readOnly = 'readOnly',
  readWrite = 'readWrite',
  fullAccess = 'fullAccess'
}

export interface AccessInterface extends mongoose.Document {
  modelName: string;
  everyone: number;
}

const accessSchema = new Schema(
  {
    modelName: {
      required: true,
      type: String
    },
    everyone: {
      required: true,
      type: Number
    },
    authedUser: {
      required: true,
      type: Number
    },
    groupOwner: {
      required: true,
      type: Number
    },
    self: {
      required: true,
      type: Number
    }
  },
  { timestamps: true, collection: 'shuttleModel' }
);

const validate = (input: string) => {
  if (!/^[0-3]{2}[0-2][01]$/.test(input)) {
    logger.warn(`Invalid access ${input} detected`);
    logger.warn(`changed to default 0000`);
  }
};

export default model<AccessInterface>('Access', accessSchema);
