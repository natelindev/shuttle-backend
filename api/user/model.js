import mongoose, { Schema } from 'mongoose';
import consts from '../../util/consts';

const userSchema = new Schema(
  {
    username: {
      required: true,
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
      enum: [consts.roles.admin, consts.roles.user]
    },
    hashedPassword: {
      required: true,
      type: String,
      select: false
    },
    lastLogin: {
      type: Date
    },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image' }
  },
  { timestamps: true },
  { collection: 'Users' }
);

module.exports = mongoose.model('User', userSchema);
