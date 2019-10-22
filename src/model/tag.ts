import { ShuttleModelWrapper } from '../builtinModels/shuttleModel';
import { access } from '../util/consts';
/**
 * Tag
 *
 * @property {ObjectId} parent
 * @property {String} name (required)
 * @property {String} icon
 *
 */
export default new ShuttleModelWrapper('tag', access.admin, true, {
  parent: 'Tag.Id',
  name: 'String!',
  icon: 'String'
});
