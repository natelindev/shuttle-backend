import { ShuttleModelWrapper } from '../builtinModels/shuttle';
import { access } from '../util/consts';

/**
 * Note
 *
 * @property {String} title (required)
 * @property {String} content (required)
 * @property {Array<ObjectId>} tags
 * @property {ObjectId} status
 * @property {ObjectId} headerImg
 * @property {Array<ObjectId>} images
 * @property {Number} viewCount (default:0)
 * @property {Number} likeCount (default:0)
 *
 */
export default new ShuttleModelWrapper('Article', access.public, true, {
  title: 'String!',
  content: 'String!',
  tags: ['Tag.Id'],
  status: 'Status.Id',
  headerImg: 'Image.Id',
  images: ['Image.Id'],
  viewCount: 'Number:0',
  likeCount: 'Number:0'
});
