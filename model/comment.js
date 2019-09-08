import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';

const commentSchema = new Schema(
  {
    // parent can be article, comment, note
    parent: { type: Schema.Types.ObjectId },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: {
      type: String,
      required: true
    },
    LikeCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true },
  { collection: 'Comments' }
);

const Comment = model('Comment', commentSchema);
const typeComposer = composeWithMongoose(Comment, {});

export { typeComposer };
export default Comment;
