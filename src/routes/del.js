'use strict';

module.exports = (app, redisClient) => {

  app.post('/del', async (req, res, next) => {
    try {
      const
        keys = req.body.keys || '',
        keysArr = keys.split(','),
        result = await redisClient.del(...keysArr) || 0;
      res.send({ result: (result > 0) });
    } catch (err) {
      next(err);
    }
  });
};
