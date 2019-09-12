import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import consts from '../util/consts';

const imageSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    access: {
      enum: [Object.values(consts.access)]
    },
    path: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    }
  },
  { timestamps: true },
  { collection: 'Images' }
);

const Image = model('Image', imageSchema);
const typeComposer = composeWithMongoose(Image, {});

export { typeComposer };
export default Image;
