import { ShuttleModelInterface } from '../builtinModels/shuttleModel';
import { predefinedAccess } from '../builtinModels/access';
/**
 * Tag
 *
 * @property {ObjectId} parent
 * @property {String} name (required)
 * @property {String} icon
 *
 */

export default {
  name: 'Tag',
  access: predefinedAccess.adminOnly,
  hasOwner: true,
  content: {
    parent: 'Tag.Id',
    name: 'String!',
    icon: 'String'
  }
} as ShuttleModelInterface;
