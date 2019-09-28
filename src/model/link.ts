import { ShuttleModel, modelTypes } from '../types/shuttleModel';

/**
 * Link
 *
 * @property {String} url (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default new ShuttleModel('Link', modelTypes.shuttle, true, {
  url: 'String!',
  description: 'String',
  icon: 'String'
});
