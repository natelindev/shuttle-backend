const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = mongoose.model('Image', imageSchema);
