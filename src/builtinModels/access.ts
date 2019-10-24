import mongoose, { Schema, model } from 'mongoose';

export enum accessType {
  noAccess = 'noAccess',
  readOnly = 'readOnly',
  readWrite = 'readWrite',
  fullAccess = 'fullAccess'
}

export interface AccessInterface {
  everyone: accessType;
  authedUser: accessType;
  groupOwner: accessType;
  self: accessType;
}

export const predefinedAccess = {
  /**
   * Everyone can read, group owner and owner have full access
   */
  public: {
    everyone: accessType.readOnly,
    authedUser: accessType.readOnly,
    groupOwner: accessType.fullAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only authed user can read, group owner and owner have full access
   */
  authedOnly: {
    everyone: accessType.noAccess,
    authedUser: accessType.readOnly,
    groupOwner: accessType.fullAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only group owner and owner have full access
   */
  groupOnly: {
    everyone: accessType.noAccess,
    authedUser: accessType.noAccess,
    groupOwner: accessType.fullAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Group owner can read and only owner have full access
   */
  groupLimited: {
    everyone: accessType.noAccess,
    authedUser: accessType.noAccess,
    groupOwner: accessType.readOnly,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only owner have full access
   */
  personal: {
    everyone: accessType.noAccess,
    authedUser: accessType.noAccess,
    groupOwner: accessType.noAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only admin have full access
   */
  adminOnly: {
    everyone: accessType.noAccess,
    authedUser: accessType.noAccess,
    groupOwner: accessType.noAccess,
    self: accessType.noAccess
  } as AccessInterface
};

const accessSchema = new Schema(
  {
    everyone: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    },
    authedUser: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    },
    groupOwner: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    },
    self: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    }
  },
  { timestamps: true, collection: 'access' }
);

interface AccessDbInterface extends AccessInterface, mongoose.Document {}
export default model<AccessDbInterface>('Access', accessSchema);
