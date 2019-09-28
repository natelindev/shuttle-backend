import mongoose, { Schema } from 'mongoose';
import { access } from '../util/consts';

export const enum modelTypes {
  shuttle = 'shuttle',
  mongooseSchema = 'mongooseSchema'
}

/**
 * Dynamic Model
 *
 * @property {String} name
 * @property {String} description
 * @property {String} content schema string
 *
 */
const shuttleModelSchema = new Schema(
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

export class ShuttleModel {
  constructor(name: string, type: modelTypes, owner: boolean, model: any) {
    this.name = name;
    this.type = type;
    this.owner = owner;
    this.model = model;
  }

  name: string;

  type: modelTypes;

  owner: boolean;

  model: any;
}

export default mongoose.model('ShuttleModel', shuttleModelSchema);
