import { ShuttleModel, modelTypes } from '../types/shuttleModel';

/**
 * Comment
 *
 * @property {ObjectId} parent (required)
 * @property {String} content (required)
 * @property {ObjectId} status
 * @property {Number} likeCount (default:0)
 *
 */
export default new ShuttleModel('Comment', modelTypes.shuttle, true, {
  parent: 'User.Id!',
  content: 'String!',
  status: 'Status.Id',
  likeCount: 'Number:0'
});
