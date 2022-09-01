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
  path = require('path'),
  nocache = require('nocache'),
  logger = require('heroku-logger'),
  { forceDomainSSL, unless , middlewareSecurity, whitelistIp } = require('./middleware'),
  redisClient = require('./redisClient');

const app = express();

app
  .use(forceDomainSSL)
  .use(middlewareSecurity)
  .use(whitelistIp)
  .use(express.static('public'))
  .use('/docs', express.static(path.join(__dirname, '../docs')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(nocache())
  .use((req, res, next) => {
    res.locals.req = req;
    res.locals.pageData = {};
    next();
  });

require('./routes')(app, redisClient, logger);

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ error: true });
});

module.exports = app.listen(PORT, async () => {
  if (NODE_ENV !== 'test') {
    logger.info(`Web worker ${process.pid} started, listening on port ${PORT}`);
  }
});
