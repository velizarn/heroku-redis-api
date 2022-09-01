'use strict';

require('dotenv').config();

const {
    APP_DOMAIN,
    NODE_ENV,
    PUBLIC_DOMAIN,
    WHITELIST_IP = ''
  } = process.env,
  logger = require('heroku-logger');

/**
 * Determines if default Heroku app domain is invoked on Production
 *
 * @param {Object} [req] Request object
 * @return {Boolean}
 */
const isAppDomainOnProduction = (req) => {
  return APP_DOMAIN !== '' &&
    PUBLIC_DOMAIN !== '' &&
    req.headers.host === APP_DOMAIN;
};

/**
 * Determines if a non secure url is requested on production
 *
 * @param {Object} [req] Request object
 * @return {Boolean}
 */
const isNonSecurePublicDomainOnProduction = (req) => {
  return PUBLIC_DOMAIN !== '' &&
    req.headers.host === PUBLIC_DOMAIN &&
    req.header('x-forwarded-proto') !== 'https';
};

/**
 * Force using HTTPS on Staging and Production
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 */
const forceDomainSSL = (req, res, next) => {
  switch(NODE_ENV) {
  case 'local':
    // @TODO
    next();
    break;
  case 'review':
  case 'staging':
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(302, `https://${req.headers.host}${req.originalUrl}`);
    }
    else {
      return next();
    }
    break;
  case 'production':
    if (isAppDomainOnProduction(req)) {
      res.redirect(302, `https://${PUBLIC_DOMAIN}${req.originalUrl}`);
    }
    else if (isNonSecurePublicDomainOnProduction(req)) {
      logger.info(`Insecure request to ${PUBLIC_DOMAIN}`);
      res.redirect(302, `https://${req.headers.host}${req.originalUrl}`);
    }
    else return next();
    break;
  default:
    return next();
  }
};

/**
 * Exclude route from express middleware
 *
 * You can add as many routes as you wish, e.g.
 *
 * app.use(unless(redirectPage, '/user/login', '/user/register'));
 *
 * @param {Object} middleware
 * @param  {...any} paths
 */
const unless = (middleware, ...paths) => (req, res, next) => {
  const pathCheck = paths.some(path => path === req.path);
  pathCheck ? next() : middleware(req, res, next);
};

const middlewareSecurity = (req, res, next) => {
  res.set('X-XSS-Protection', '1; mode=block');
  return next();
};

/**
 * A middleware to skip HTTP requests for .map files
 * Don't use this method if you actually have sourcemap files for minified files.
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 */
const skipMap = (req, res, next) => {
  if (req.path.match(/\.map$/i)) {
    res.send('');
  } else {
    return next();
  }
};

/**
 * Restrict access by IP address/es
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 */
const whitelistIp = (req, res, next) => {
  if (WHITELIST_IP === '') {
    return next();
  }
  const request_ip = (
    req.headers['cf-connecting-ip'] ||
    req.headers['fastly-client-ip'] ||
    req.headers['fly-client-ip'] ||
    req.headers['do-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'].split(',')[0] ||
    req.ip || ''
  ).split(',')[0].trim();

  if (WHITELIST_IP.split(',').includes(request_ip)) {
    return next();
  } else {
    res.status(403).send('Forbidden: Access is denied.');
  }
};

module.exports = {
  isAppDomainOnProduction,
  isNonSecurePublicDomainOnProduction,
  forceDomainSSL,
  unless,
  middlewareSecurity,
  skipMap,
  whitelistIp
};

/**
 * How to get a User's IP Address in Express.js
 *
 * Cloudflare: https://developers.cloudflare.com/fundamentals/get-started/reference/http-request-headers/
 *  True-Client-IP provides the original client IP address to the origin web server.
 *  There is no difference between the True-Client-IP and CF-Connecting-IP headers =
 *  besides the name of the header. Some Enterprise customers with legacy devices need True-Client-IP
 *  to avoid updating firewalls or load-balancers to read a custom header name.
 *
 * Fastly: https://developer.fastly.com/reference/http/http-headers/Fastly-Client-IP/
 *  When Fastly receives a request that does not include a Fastly-Client-IP header,
 *  it will add one, set to the current value of client.ip.
 *  This provides convenient access to the IP address that Fastly regards as the client making the request.
 *
 * Nginx and FastCGI: X-Real-IP
 *
 * Akamai: True-Client-Ip
 *
 * Fly.io: https://fly.io/docs/reference/runtime-environment/
 *  Fly-Client-IP - The IP address Fly accepted a connection from.
 *  This will be the client making the initial request and as such,
 *  will also appear at the start of the X-Forwarded-For addresses.
 *
 * DigitalOcean: do-connecting-ip
 *
 * Express JS: http://expressjs.com/en/4x/api.html#req.ip
 *  req.ip - Contains the remote IP address of the request.
 *  When the trust proxy setting does not evaluate to false,
 *  the value of this property is derived from the left-most entry in the X-Forwarded-For header.
 *  This header can be set by the client or by the proxy.
 *
 * @TODO Render.com, Scalingo
 *
 * https://stackabuse.com/bytes/how-to-get-a-users-ip-address-in-express-js/
 * https://stackoverflow.com/questions/72557636/difference-between-x-forwarded-for-and-x-real-ip-headers
 */
