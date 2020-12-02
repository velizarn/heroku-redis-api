/* eslint no-unused-vars: 0 */
'use strict';

require('dotenv').config();

const defaults = require('./defaults');

const {
  NODE_ENV,
  PORT = defaults.appPort,
} = process.env;

const
  bodyParser = require('body-parser'),
  express = require('express'),
  logger = require('heroku-logger'),
  { forceDomainSSL, unless , middlewareSecurity, whitelistIp } = require('./middleware'),
  redisClient = require('./redisClient');

const app = express();

app
  .use(forceDomainSSL)
  .use(middlewareSecurity)
  .use(whitelistIp)
  .use(express.static('public'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use((req, res, next) => {
    res.locals.req = req;
    res.locals.pageData = {};
    next();
  });

app.get('/', (req, res, next) => {
  const dateStr = (new Date()).toLocaleString();
  const pageData = `${dateStr} - ${req.header('host')}`;
  res.send(pageData);
});

require('./routes')(app, redisClient, logger);

app.get('/insomnia.json', (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const insomnia = require('./insomnia');
  insomnia.__export_date = (new Date()).toISOString();
  const resources = insomnia.resources.map((item) => {
    return (item._type === 'request_group')
      ? Object.assign({}, item, { environment: { api_root: baseUrl } })
      : item;
  });
  const insomniaUpd = Object.assign({}, insomnia, { resources });
  res.send(insomniaUpd);
});

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ error: true });
});

module.exports = app.listen(PORT, async () => {
  if (NODE_ENV !== 'test') {
    logger.info(`Web worker ${process.pid} started, listening on port ${PORT}`);
  }
});
