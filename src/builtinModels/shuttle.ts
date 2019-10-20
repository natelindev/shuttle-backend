import mongoose, { Schema } from 'mongoose';
import { access } from '../util/consts';
import getLogger from '../util/logger';

const logger = getLogger('shuttleModel');

/**
 * Dynamic Model
 *
 * @property {String} name
 * @property {String} description
 * @property {String} content schema string
 *
 */
const shuttleSchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    access: {
      required: true,
      type: String,
      enum: Object.values(access)
    },
    hasOwner: {
      required: true,
      type: Boolean
    },
    content: {
      required: true,
      type: Schema.Types.Mixed
    }
  },
  { timestamps: true, collection: 'shuttleModel' }
);

export interface ShuttleInterface extends mongoose.Document {
  name: string;
  access: access | string;
  hasOwner: boolean;
  content: ShuttleSchema;
}

export interface ShuttleSchema {
  [key: string]: any;
}

export class ShuttleModelWrapper {
  constructor(name: string, acc: access | string, hasOwner: boolean, model: ShuttleSchema) {
    this.name = name;
    this.hasOwner = hasOwner;
    this.access = acc;
    this.model = model;
    ((): void => {
      if (!/^[0-3]{2}[0-2][01]$/.test(acc)) {
        this.access = '0000';
        logger.warn(`Invalid access ${acc} detected`);
        logger.warn(`changed to default 0000`);
      }
    })();
  }

  name: string;

  access: access | string;

  hasOwner: boolean;

  model: ShuttleSchema;
}

export default mongoose.model<ShuttleInterface>('ShuttleModel', shuttleSchema);
