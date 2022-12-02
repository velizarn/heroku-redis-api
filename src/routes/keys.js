'use strict';

// https://stackoverflow.com/questions/30271808/naming-convention-and-valid-characters-for-a-redis-key

module.exports = (app, redisClient) => {

  app.get('/keys', async (req, res, next) => {
    try {
      const
        pattern = req.query.pattern || '*', // :pattern([.-_:a-zA-Z0-9]+)?
        keys = await redisClient.keys(pattern);
      res.send(keys);
    } catch (err) {
      next(err);
    }
  });
};
