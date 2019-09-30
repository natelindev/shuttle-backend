import { ShuttleModelWrapper } from '../builtinModels/shuttle';

/**
 * Link
 *
 * @property {String} url (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default new ShuttleModelWrapper('Link', true, {
  url: 'String!',
  description: 'String',
  icon: 'String'
});
