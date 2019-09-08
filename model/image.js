import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';

const imageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    path: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: { type: Schema.Types.ObjectId, ref: 'Status' }
  },
  { timestamps: true },
  { collection: 'Images' }
);

const Image = model('Image', imageSchema);
const typeComposer = composeWithMongoose(Image, {});

export { typeComposer };
export default Image;
