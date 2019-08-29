const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = mongoose.model('Note', noteSchema);
