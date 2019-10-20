import { ShuttleModelWrapper } from '../builtinModels/shuttle';
import { access } from '../util/consts';
/**
 * Status
 *
 * @property {String} name (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default new ShuttleModelWrapper('status', access.admin, true, {
  name: 'String!',
  description: 'String',
  icon: 'String'
});
