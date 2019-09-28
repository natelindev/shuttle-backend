import { ShuttleModel, modelTypes } from '../types/shuttleModel';

/**
 * Tag
 *
 * @property {ObjectId} parent
 * @property {String} name (required)
 * @property {String} icon
 *
 */
export default new ShuttleModel('tag', modelTypes.shuttle, true, {
  parent: 'Tag.Id',
  name: 'String!',
  icon: 'String'
});
