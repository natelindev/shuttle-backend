import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: {
      type: String,
      required: true
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    status: { type: Schema.Types.ObjectId, ref: 'Status' },
    headerImg: { type: Schema.Types.ObjectId, ref: 'Image' },
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true },
  { collection: 'Articles' }
);

export default model('Article', articleSchema);
