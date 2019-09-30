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
    type: {
      required: true,
      type: String
    },
    content: {
      required: true,
      type: String
    },
    access: {
      required: true,
      type: String,
      enum: Object.values(access)
    }
  },
  { timestamps: true, collection: 'shuttleModel' }
);

export interface ShuttleInterface extends mongoose.Document {
  name: string;
  type: string;
  content: string;
  access: access;
}

export class ShuttleModelWrapper {
  constructor(name: string, owner: boolean, model: any) {
    this.name = name;
    this.owner = owner;
    this.model = model;
  }

  name: string;

  owner: boolean;

  model: any;
}

export default mongoose.model<ShuttleInterface>('ShuttleModel', shuttleSchema);
