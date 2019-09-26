import { model, Schema } from 'mongoose';
import consts from '../util/consts';

/**
 * Dynamic Model
 *
 * @property {String} name
 * @property {String} description
 * @property {String} content schema string
 *
 */
const dynamicModelSchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    description: {
      type: String
    },
    content: {
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
