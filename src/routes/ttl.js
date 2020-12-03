'use strict';

module.exports = (app, redisClient, logger) => {

  app.get('/ttl', async (req, res, next) => {
    try {

      const key = req.query.key || ''; // @TODO :key([.-_:a-zA-Z0-9]+)

      res.set('Content-Type', 'text/plain');

      const ttl = await redisClient.ttlAsync(key);

      res.send(`${ttl}`);

    } catch (err) {
      logger.error(err.message);
    }
  });
};
