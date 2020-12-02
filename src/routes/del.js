'use strict';

module.exports = (app, redisClient, logger) => {

  app.post('/del', async (req, res) => {
    try {
      const
        keys = req.body.keys || '',
        keysArr = keys.split(','),
        result = await redisClient.delAsync(...keysArr) || 0;
      res.send({ result: (result > 0) });
    } catch (err) {
      logger.error(err.stack);
    }
  });
};
