import { ShuttleModelWrapper } from '../builtinModels/shuttle';
import { access } from '../util/consts';
/**
 * Note
 *
 * @property {String} title (required)
 * @property {String} content (required)
 * @property {Array<ObjectId>} tags
 * @property {ObjectId} status
 * @property {Array<ObjectId>} images
 * @property {Number} likeCount (default:0)
 *
 */
export default new ShuttleModelWrapper('Note', access.group, true, {
  title: 'String!',
  content: 'String!',
  tags: ['Tag.Id'],
  status: 'Status.Id',
  images: ['Image.Id'],
  likeCount: 'Number:0'
});
