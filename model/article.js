import consts from '../util/consts';

export default {
  [consts.property.owner]: true,
  title: 'String!',
  content: 'String!',
  tags: 'Tag.Id',
  status: 'Status.Id',
  headerImg: 'Image.Id',
  images: ['Image.Id'],
  viewCount: 'Number:0',
  likeCount: 'Number:0'
};
