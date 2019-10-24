import mongoose, { Schema, model } from 'mongoose';
import { UserInterface } from './user';

/**
 * UserGroups
 *
 * @property {String} name (required)
 * @property {User} owner (required)
 * @property {User[]} members
 *
 */
export const userGroupSchema = new Schema(
  {
    name: {
      required: true,
      index: true,
      unique: true,
      type: String
    },
    owner: {
      type: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true, collection: 'UserGroup' }
);

export interface UserGroupsInterface {
  name: string;
  owner: UserInterface;
  members: UserInterface[];
}

interface UserGroupsDbInterface extends UserGroupsInterface, mongoose.Document {}
export default model<UserGroupsDbInterface>('UserGroup', userGroupSchema);
