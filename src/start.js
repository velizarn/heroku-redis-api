'use strict';

require('dotenv').config();

const {
  NODE_ENV,
  WEB_CONCURRENCY
} = process.env;

const
  cluster = require('cluster'),
  logger = require('heroku-logger');

const WORKERS = WEB_CONCURRENCY || require('os').cpus().length;

const worker = () => {
  require('./server');
  logger.info(`Job worker ${process.pid} started`);
};

if (NODE_ENV !== 'test') {

  if (cluster.isMaster) {

    logger.info(`Master process ${process.pid} is running`);

    for (let i = 0, p = Promise.resolve(); i < WORKERS; i++) {
      p = p.then(_ => new Promise(resolve => {
        cluster.fork();
        resolve();
      }));
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });

  } else {
    worker();
  }

} else {
  worker();
}