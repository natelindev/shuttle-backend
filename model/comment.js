import consts from '../util/consts';

export default {
  [consts.property.owner]: true,
  parent: 'User.Id!',
  content: 'String!',
  status: 'Status.Id',
  likeCount: 'Number:0'
};
