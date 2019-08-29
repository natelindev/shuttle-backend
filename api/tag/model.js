const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = mongoose.model('Tag', tagSchema);
