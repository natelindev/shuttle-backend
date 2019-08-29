import { Schema, model } from 'mongoose';

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  },
  { timestamps: true },
  { collection: 'items' }
);

export default model('Item', itemSchema);
