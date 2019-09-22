import { model, Schema } from 'mongoose';
import consts from '../util/consts';

const userSchema = new Schema(
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
      enum: Object.values(consts.role)
    },
    [consts.property.access]: {
      required: true,
      type: String,
      enum: Object.values(consts.access)
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
  { timestamps: true },
  { collection: 'user' }
);

export default model('User', userSchema);
