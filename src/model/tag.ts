import consts from '../util/consts';

/**
 * Tag
 *
 * @property {ObjectId} parent
 * @property {String} name (required)
 * @property {String} icon
 *
 */
export default {
  [consts.property.owner]: false,
  parent: 'Tag.Id',
  name: 'String!',
  icon: 'String'
};
