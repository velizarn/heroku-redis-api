'use strict';

module.exports = (app, redisClient) => {

  app.get('/scan', async (req, res, next) => {
    try {
      const
        cursor = req.query.cursor || 0,
        count = parseInt(req.query.count) || 0,
        options = count > 0 ? { COUNT: count } : {},
        keys = await redisClient.scan(cursor, options);
      res.send(keys);
    } catch (err) {
      next(err);
    }
  });
};
