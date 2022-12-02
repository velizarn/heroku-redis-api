'use strict';

module.exports = (app, redisClient) => {

  app.get('/type', async (req, res, next) => {
    try {

      const
        key = req.query.key || '', // @TODO :key([.-_:a-zA-Z0-9]+)
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        keyExists = await redisClient.exists(key) || 0;

      res.set('Content-Type', 'text/plain');

      if (keyExists === 1) {

        // https://redis.io/commands/type
        // The different types that can be returned are: string, list, set, zset, hash and stream.
        const type = await redisClient.type(key);

        res.send(type);
      } else {
        res.send('not found');
      }

    } catch (err) {
      next(err);
    }
  });
};
