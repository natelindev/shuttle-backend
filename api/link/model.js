import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';

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

const Link = model('Link', linkSchema);
const typeComposer = composeWithMongoose(Link, {});

export { typeComposer };
export default Link;
