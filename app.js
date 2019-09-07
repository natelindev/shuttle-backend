import express from 'express';
import { urlencoded, json } from 'body-parser';
import 'dotenv/config';
import expressSession from 'express-session';
import graphqlHTTP from 'express-graphql';
import getLogger from './util/logger';
import apiLogger from './util/apiLogger';
import db from './database';
import importHandler from './util/importHandler';
import getApiList from './util/apiRegister';
import getGraphQLSchema from './util/graphqlHandler';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));
const app = express();

// Api Logger
app.use(apiLogger);

// Error Handling
app.use((req, res, next, err) => {
  logger.error(err);
});

app.use(urlencoded({ extended: false }));
app.use(json());
app.disable('x-powered-by');

// Import and Mount routers
(async () => {
  const apiList = await getApiList();
  const routerPaths = apiList.map(api => `../api/${api}/router`);
  let routers = importHandler.importMany(routerPaths);

  if (routers && routers.length > 0) {
    routers = routers.filter(router => router !== null);
    routers.forEach(router => {
      app.use('/api', router);
    });
  }
})();

// Enable GraphQL
(async () => {
  const graphqlSchema = await getGraphQLSchema();
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true
    })
  );
})();

// Database
db.connect();

// Session
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// Listen
app
  .listen(process.env.PORT || 8000)
  .on('listening', () => {
    logger.info(
      `Lonefire Js REST API Server is listening on port ${process.env.PORT ||
      8000}`
    );
  })
  .on('error', err => {
    logger.error(err);
  });
