import express from 'express';
import { urlencoded, json } from 'body-parser';
import 'dotenv/config';
import expressSession from 'express-session';
import graphqlHTTP from 'express-graphql';
import getLogger from './util/logger';
import apiLogger from './util/apiLogger';
import db from './database';
import getGraphQLSchema from './api/graphql';
import getRestRouters from './api/rest';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));
const app = express();

// Api logger
app.use(apiLogger);

// Application wide error handling
app.use((req, res, next, err) => {
  logger.error(err);
});

// Body parser
app.use(urlencoded({ extended: false }));
app.use(json());
app.disable('x-powered-by');

// Enable REST
(async () => {
  const restRouters = await getRestRouters();
  if (restRouters && restRouters.length > 0) {
    restRouters.forEach(router => {
      app.use('/rest', router);
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

// Index page message
app.get('/', (req, res) => {
  res.send('Lonefire Js REST/GraphQL API Server');
});

// Session
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// Database
db.connect();

// Listen
app
  .listen(process.env.PORT || 8000)
  .on('listening', () => {
    logger.info(
      `Lonefire Js REST/GraphQL API Server is listening on port ${process.env
        .PORT || 8000}`
    );
  })
  .on('error', err => {
    logger.error(err);
  });
