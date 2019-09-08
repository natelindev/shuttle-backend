import { model, Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';

const statusSchema = new Schema(
  {
    description: {
      type: String
    },
    icon: {
      type: String
    }
  },
  { timestamps: true },
  { collection: 'Statuses' }
);

const Status = model('Status', statusSchema);
const typeComposer = composeWithMongoose(Status, {});

export { typeComposer };
export default Status;
