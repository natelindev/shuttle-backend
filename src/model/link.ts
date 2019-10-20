import { ShuttleModelWrapper } from '../builtinModels/shuttle';
import { access } from '../util/consts';

/**
 * Link
 *
 * @property {String} url (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default new ShuttleModelWrapper('Link', access.admin, true, {
  url: 'String!',
  description: 'String',
  icon: 'String'
});
