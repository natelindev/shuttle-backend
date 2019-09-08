import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';

const tagSchema = new Schema(
  {
    Parent: { type: Schema.Types.ObjectId, ref: 'Tag' },
    Name: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
  { collection: 'Tags' }
);

const Tag = model('Tag', tagSchema);
const typeComposer = composeWithMongoose(Tag, {});

export { typeComposer };
export default Tag;
