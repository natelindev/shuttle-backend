import mongoose, { Schema } from 'mongoose';
import { access } from '../util/consts';

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
  constructor(name: string, hasOwner: boolean, model: ShuttleSchema) {
    this.name = name;
    this.hasOwner = hasOwner;
    this.model = model;
  }

  name: string;

  hasOwner: boolean;

  model: ShuttleSchema;
}

export default mongoose.model<ShuttleInterface>('ShuttleModel', shuttleSchema);
