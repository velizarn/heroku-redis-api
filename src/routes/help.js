'use strict';

module.exports = (app) => {

  app.get('/help', async (req, res, next) => {
    res.send(require('../endpoints'));
  });
};
