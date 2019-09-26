import consts from '../util/consts';

/**
 * Image
 *
 * @property {String} path (required)
 * @property {String} filename (required)
 * @property {Number} height
 * @property {Number} width
 *
 */
export default {
  [consts.property.owner]: true,
  path: 'String!',
  filename: 'String!',
  height: 'Number',
  width: 'Number'
};
