'use strict';

require('dotenv').config();

const
  {
    REDIS_PASSWORD = '',
    REDIS_CA = '',
    REDIS_URL,
    REDIS_APPKEY_PREFIX = ''
  } = process.env,
  logger = require('heroku-logger'),
  redis = require('redis');

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

    const defaultFunctions = [
      'info',
      'ping', // no arguments
      'keys',
      'scan'
    ];

    const customizedCommands = [
      'del',
      'get',
      'ttl',
      'expire',
      'exists',
      'type'
    ];

    redisClient = redis.createClient(redisOptions());

    redisClient.on('error', (err) => console.log('redis.js: Redis Client Error', err));

    defaultFunctions.map((fn) => {
      customRedisClient[`${fn}`] = (...args) => {
        return redisClient[`${fn}`](...args);
      };
    });

    customizedCommands.map((fn) => {
      customRedisClient[`${fn}`] = (...args) => {
        args[0] = REDIS_APPKEY_PREFIX.concat(args[0]);
        return redisClient[`${fn}`](...args);
      };
    });

    await redisClient.connect();

    // await redisClient.ping();

  } catch (err) {
    logger.error(err.stack);
  }

})();

module.exports = customRedisClient;