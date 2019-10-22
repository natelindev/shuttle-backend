import { ShuttleModelWrapper } from '../builtinModels/shuttleModel';
import { access } from '../util/consts';

/**
 * Image
 *
 * @property {String} path (required)
 * @property {String} filename (required)
 * @property {Number} height
 * @property {Number} width
 *
 */
export default new ShuttleModelWrapper('Image', access.group, true, {
  path: 'String!',
  filename: 'String!',
  height: 'Number',
  width: 'Number'
});
