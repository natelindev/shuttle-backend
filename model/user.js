import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
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
      enum: [consts.roles.admin, consts.roles.user]
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
  { collection: 'Users' }
);

const User = model('User', userSchema);
const typeComposer = composeWithMongoose(User, {});

export { typeComposer };
export default User;
