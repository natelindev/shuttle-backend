import { ShuttleModel, modelTypes } from '../types/shuttleModel';

/**
 * Status
 *
 * @property {String} name (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default new ShuttleModel('status', modelTypes.shuttle, true, {
  name: 'String!',
  description: 'String',
  icon: 'String'
});
