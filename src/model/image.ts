import { ShuttleModelWrapper } from '../builtinModels/shuttle';

/**
 * Image
 *
 * @property {String} path (required)
 * @property {String} filename (required)
 * @property {Number} height
 * @property {Number} width
 *
 */
export default new ShuttleModelWrapper('Image', true, {
  path: 'String!',
  filename: 'String!',
  height: 'Number',
  width: 'Number'
});
