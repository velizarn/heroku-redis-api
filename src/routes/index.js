'use strict';

module.exports = (app, redisClient, logger) => {

  require('./help')(app);
  require('./info')(app, redisClient, logger);
  require('./keys')(app, redisClient, logger);
  require('./get')(app, redisClient, logger);
  require('./type')(app, redisClient, logger);
  require('./del')(app, redisClient, logger);

};