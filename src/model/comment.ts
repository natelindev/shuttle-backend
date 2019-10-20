import { ShuttleModelWrapper } from '../builtinModels/shuttle';
import { access } from '../util/consts';

/**
 * Comment
 *
 * @property {ObjectId} parent (required)
 * @property {String} content (required)
 * @property {ObjectId} status
 * @property {Number} likeCount (default:0)
 *
 */
export default new ShuttleModelWrapper('Comment', access.public, true, {
  parent: 'User.Id!',
  content: 'String!',
  status: 'Status.Id',
  likeCount: 'Number:0'
});
