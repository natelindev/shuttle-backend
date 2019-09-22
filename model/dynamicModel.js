import { model, Schema } from 'mongoose';
import consts from '../util/consts';

const dynamicModelSchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    description: {
      type: String
    },
    conponent: {
      required: true,
      type: String
    },
    [consts.property.access]: {
      required: true,
      type: String,
      enum: Object.values(consts.access)
    }
  },
  { timestamps: true },
  { collection: 'dynamicModel' }
);

export default model('DynamicModel', dynamicModelSchema);
