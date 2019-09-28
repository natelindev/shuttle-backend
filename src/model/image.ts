import { ShuttleModel, modelTypes } from '../types/shuttleModel';

/**
 * Image
 *
 * @property {String} path (required)
 * @property {String} filename (required)
 * @property {Number} height
 * @property {Number} width
 *
 */
export default new ShuttleModel('Image', modelTypes.shuttle, true, {
  path: 'String!',
  filename: 'String!',
  height: 'Number',
  width: 'Number'
});
