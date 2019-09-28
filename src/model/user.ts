import mongoose, { Schema } from 'mongoose';
import { ShuttleModel, modelTypes } from '../types/shuttleModel';

export enum roles {
  admin = 'admin',
  groupOwner = 'groupOwner',
  user = 'user'
}

/**
 * User
 *
 * @property {String} username (required)
 * @property {String} nickname
 * @property {String} description
 * @property {String} role (required)
 * @property {String} hashedPassword (required)
 * @property {Date} lastLogin
 * @property {ObjectId} avatar
 *
 */
export const userSchema = {
  username: {
    required: true,
    index: true,
    unique: true,
    type: String
  },
  nickname: {
    type: String
  },
  description: {
    type: String
  },
  role: {
    required: true,
    type: String,
    enum: Object.values(roles)
  },
  hashedPassword: {
    required: true,
    type: String
  },
  lastLogin: {
    type: Date
  },
  avatar: { type: Schema.Types.ObjectId, ref: 'Image' }
};

export interface UserType extends mongoose.Document {
  username: string;
  nickname: string;
  description: string;
  role: roles;
  hashedPassword: string;
  lastLogin: Date;
  avatar: Schema.Types.ObjectId;
}

export default new ShuttleModel('User', modelTypes.mongooseSchema, true, userSchema);
