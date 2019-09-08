import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';

const noteSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: {
      type: String,
      required: true
    },
    status: { type: Schema.Types.ObjectId, ref: 'Status' },
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    likeCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
  { collection: 'Notes' }
);

const Note = model('Note', noteSchema);
const typeComposer = composeWithMongoose(Note, {});

export { typeComposer };
export default Note;
