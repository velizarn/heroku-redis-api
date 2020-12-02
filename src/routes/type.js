'use strict';

module.exports = (app, redisClient, logger) => {

  app.get('/type', async (req, res, next) => {
    try {

      const
        key = req.query.key || '', // @TODO :key([.-_:a-zA-Z0-9]+)
        keyExists = await redisClient.existsAsync(key) || 0;

      res.set('Content-Type', 'text/plain');

      if (keyExists === 1) {

        // https://redis.io/commands/type
        // The different types that can be returned are: string, list, set, zset, hash and stream.
        const type = await redisClient.typeAsync(key);

        res.send(type);
      } else {
        res.send('not found');
      }

    } catch (err) {
      logger.error(err.message);
    }
  });
};
