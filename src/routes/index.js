'use strict';

module.exports = (app, redisClient) => {

  require('./homepage')(app, redisClient);
  require('./help')(app);
  require('./insomnia')(app);
  require('./info')(app, redisClient);
  require('./keys')(app, redisClient);
  require('./get')(app, redisClient);
  require('./type')(app, redisClient);
  require('./ttl')(app, redisClient);
  require('./del')(app, redisClient);
};
