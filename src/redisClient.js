'use strict';

require('dotenv').config();

const {
  REDIS_PASSWORD = '',
  REDIS_CA = '',
  REDIS_URL
} = process.env;

const
  logger = require('heroku-logger'),
  redis = require('redis'),
  { REDIS_APPKEY_PREFIX = '' } = process.env;

let redisClient, customRedisClient = {};

const redisOptions = (legacyMode = false) => {

  const options = {
    url: REDIS_URL,
    legacyMode
  };

  if (REDIS_PASSWORD !== '') {
    options.password = REDIS_PASSWORD;
  }

  if (REDIS_CA !== '') {
    options.socket.tls = {
      cert: REDIS_CA,
      ca: [ REDIS_CA ]
    };
  }

  return options;
};

;(async () => {

  try {

    redisClient = redis.createClient(redisOptions());

    redisClient.on('error', (err) => console.log('redis.js: Redis Client Error', err));

    await redisClient.connect();

    // await redisClient.ping();

  } catch (err) {
    logger.error(err.stack);
  }

})();

module.exports = redisClient;