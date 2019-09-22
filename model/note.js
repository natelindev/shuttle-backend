import consts from '../util/consts';

export default {
  [consts.property.owner]: true,
  title: 'String!',
  content: 'String!',
  tags: ['Tag.Id'],
  status: 'Status.Id',
  images: ['Image.Id'],
  likeCount: 'Number:0'
};
