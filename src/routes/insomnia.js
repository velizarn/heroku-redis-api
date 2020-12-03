'use strict';

module.exports = (app) => {

  app.get('/insomnia.json', (req, res, next) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const insomnia = require('../insomnia');
    insomnia.__export_date = (new Date()).toISOString();
    const resources = insomnia.resources.map((item) => {
      return (item._type === 'request_group')
        ? Object.assign({}, item, { environment: { api_root: baseUrl } })
        : item;
    });
    const insomniaUpd = Object.assign({}, insomnia, { resources });
    res.send(insomniaUpd);
  });
};
