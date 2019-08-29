const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = mongoose.model('Comment', commentSchema);
