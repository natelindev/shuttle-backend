import { Schema, model } from 'mongoose';

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    schema: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
  { collection: 'items' }
);

export default model('Item', itemSchema);
