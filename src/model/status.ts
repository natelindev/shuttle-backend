import { ShuttleModelInterface } from '../builtinModels/shuttleModel';
import { predefinedAccess } from '../builtinModels/access';
/**
 * Status
 *
 * @property {String} name (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default {
  name: 'Status',
  access: predefinedAccess.adminOnly,
  hasOwner: true,
  content: {
    name: 'String!',
    description: 'String',
    icon: 'String'
  }
} as ShuttleModelInterface;
