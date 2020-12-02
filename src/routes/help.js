'use strict';

module.exports = (app) => {

  app.get('/help', async (req, res, next) => {
    res.send([
      {
        route: 'GET /help',
        description: 'Displays all available endpoints'
      },
      {
        route: 'GET /info',
        description: 'Returns information and statistics about the server'
      },
      {
        route: 'GET /insomnia.json',
        description: 'Returns data to import a ready-to-use collection into Insomnia Core'
      },
      {
        route: 'GET /keys',
        description: 'Returns all keys, optionally you can set a pattern, e.g. /keys?pattern=name*'
      },
      {
        route: 'GET /get?key=',
        description: 'Get the value of key. If the key does not exist the special value nil is returned. An error is returned if the value stored at key is not a string, because GET only handles string values.'
      },
      {
        route: 'GET /type?key=',
        description: 'Returns the string representation of the type of the value stored at key.'
      },
      {
        route: 'POST /del',
        description: 'Removes the specified key/s, e.g. keys=foo, keys=foo1,foo2,foo3, etc. A key is ignored if it does not exist.'
      }
    ]);
  });
};
