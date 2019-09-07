import { schemaComposer } from 'graphql-compose';
import getApiList from './apiRegister';
import importHandler from './importHandler';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const getGraphQLSchema = async () => {
  try {
    const apiList = await getApiList();
    const tcPaths = apiList.map(api => `../api/${api}/model`);
    let typeComposerWrapper = await importHandler.importMany(
      tcPaths,
      'typeComposer'
    );

    if (typeComposerWrapper && typeComposerWrapper.length > 0) {
      typeComposerWrapper = typeComposerWrapper
        .map((tc, idx) => ({ name: apiList[idx], tc }))
        .filter(tcw => tcw.tc);
      if (typeComposerWrapper && typeComposerWrapper.length > 0) {
        typeComposerWrapper.forEach(tcw => {
          schemaComposer.Query.addFields({
            [`${tcw.name}ById`]: tcw.tc.getResolver('findById'),
            [`${tcw.name}ByIds`]: tcw.tc.getResolver('findByIds'),
            [`${tcw.name}One`]: tcw.tc.getResolver('findOne'),
            [`${tcw.name}Many`]: tcw.tc.getResolver('findMany'),
            [`${tcw.name}Count`]: tcw.tc.getResolver('count'),
            [`${tcw.name}Connection`]: tcw.tc.getResolver('connection'),
            [`${tcw.name}Pagination`]: tcw.tc.getResolver('pagination')
          });

          schemaComposer.Mutation.addFields({
            [`${tcw.name}CreateOne`]: tcw.tc.getResolver('createOne'),
            [`${tcw.name}CreateMany`]: tcw.tc.getResolver('createMany'),
            [`${tcw.name}UpdateById`]: tcw.tc.getResolver('updateById'),
            [`${tcw.name}UpdateOne`]: tcw.tc.getResolver('updateOne'),
            [`${tcw.name}UpdateMany`]: tcw.tc.getResolver('updateMany'),
            [`${tcw.name}RemoveById`]: tcw.tc.getResolver('removeById'),
            [`${tcw.name}RemoveOne`]: tcw.tc.getResolver('removeOne'),
            [`${tcw.name}RemoveMany`]: tcw.tc.getResolver('removeMany')
          });
        });
      }
      const graphqlSchema = schemaComposer.buildSchema();
      return graphqlSchema;
    }
    return null;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export default getGraphQLSchema;
