import { ShuttleModelWrapper } from '../builtinModels/shuttle';
/**
 * Status
 *
 * @property {String} name (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default new ShuttleModelWrapper('status', true, {
  name: 'String!',
  description: 'String',
  icon: 'String'
});
