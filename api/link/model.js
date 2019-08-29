import mongoose, { Schema } from 'mongoose';

const linkSchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    icon: {
      type: String
    }
  },
  { timestamps: true },
  { collection: 'Links' }
);

export default mongoose.model('Link', linkSchema);
