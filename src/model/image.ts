import { ShuttleModelInterface } from '../builtinModels/shuttleModel';
import { predefinedAccess } from '../builtinModels/access';

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
  name: 'Image',
  access: predefinedAccess.userOnly,
  hasOwner: true,
  content: {
    path: 'String!',
    filename: 'String!',
    height: 'Number',
    width: 'Number'
  }
} as ShuttleModelInterface;
