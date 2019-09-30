import { ShuttleModelWrapper } from '../builtinModels/shuttle';

/**
 * Tag
 *
 * @property {ObjectId} parent
 * @property {String} name (required)
 * @property {String} icon
 *
 */
export default new ShuttleModelWrapper('tag', true, {
  parent: 'Tag.Id',
  name: 'String!',
  icon: 'String'
});
