import express from 'express';
import { urlencoded, json } from 'body-parser';
import 'dotenv/config';
import getLogger from './util/logger';
import apiLogger from './util/apiLogger';
import db from './database';
import getApiList from './util/apiRegister';

const logger = getLogger('app');
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
app.use('/', (req, res) => res.send('Lonefire.js - Backend REST API'));
// Mount routers
(async () => {
  try {
    const apiList = await getApiList();
    let routers = null;
    if (apiList && apiList.length > 0) {
      routers = await Promise.all(
        apiList.map(async api => {
          try {
            const imported = await import(`./api/${api}/router`);
            logger.debug(`Mounted api router: [${api}]`);
            return imported.default;
          } catch (err) {
            logger.warning(`Failed to mount router for api: [${api}]`);
            return null;
          }
        })
      );
    }
    if (routers && routers.length > 0) {
      routers = routers.filter(router => router !== null);
      routers.forEach(router => {
        app.use('/api', router);
      });
    }
  } catch (err) {
    logger.error(err);
  }
})();

// Database
db.connect();

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
