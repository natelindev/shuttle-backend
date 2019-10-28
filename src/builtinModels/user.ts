import mongoose, { Schema, model } from 'mongoose';

export enum roles {
  admin = 'admin',
  operator = 'operator',
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
export const userSchema = new Schema(
  {
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
  },
  { timestamps: true, collection: 'User' }
);

export interface UserInterface {
  username: string;
  nickname: string;
  description: string;
  role: roles;
  hashedPassword: string;
  lastLogin: Date;
  avatar: Schema.Types.ObjectId;
}

interface UserDbInterface extends UserInterface, mongoose.Document {}
export default model<UserDbInterface>('User', userSchema);
