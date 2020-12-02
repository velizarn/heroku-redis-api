'use strict';

// https://stackoverflow.com/questions/30271808/naming-convention-and-valid-characters-for-a-redis-key

module.exports = (app, redisClient, logger) => {

  app.get('/keys', async (req, res, next) => {
    try {
      const
        pattern = req.query.pattern || '*', // :pattern([.-_:a-zA-Z0-9]+)?
        keys = await redisClient.keysAsync(pattern);
      res.send(keys);
    } catch (err) {
      logger.error(err.stack);
    }
  });
};
