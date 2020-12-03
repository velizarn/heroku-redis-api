'use strict';

const
  fs = require('fs'),
  util = require('util');

module.exports = (app, redisClient, logger) => {

  app.get('/', async (req, res, next) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const readFile = util.promisify(fs.readFile);
      const filedata = await readFile(`${__dirname}/../homepage.html`);
      let html = filedata.toString()
        .replace(/{{LABEL}}/g, 'Redis API')
        .replace(/{{LABELENC}}/g, encodeURIComponent('Redis API'))
        .replace(/{{JSONURL}}/g, encodeURIComponent(`${baseUrl}/insomnia.json`));
      const endpoints = require('../endpoints');
      let epHtml = '<dl>';
      endpoints.forEach((item) => {
        epHtml += `<dt>${item.route}</dt><dd>${item.description}</dd>`;
      });
      epHtml += '</dl>';
      html += epHtml;
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      logger.error(err.message);
    }
  });
};
