'use strict';

module.exports = (app, redisClient) => {

  app.get('/ttl', async (req, res, next) => {
    try {

      const key = req.query.key || ''; // @TODO :key([.-_:a-zA-Z0-9]+)

      res.set('Content-Type', 'text/plain');

      const ttl = await redisClient.ttl(key);

      res.send(`${ttl}`);

    } catch (err) {
      next(err);
    }
  });
};
