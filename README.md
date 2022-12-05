# heroku-redis-api

<img src="public/redis.png" alt="Redis + Node.js" /><br />
A Redis REST API with NodeJS using Expressjs and Redis, Inspired by [lucianostraga/heroku-redis-node-rest-api](https://github.com/lucianostraga/heroku-redis-node-rest-api).

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/velizarn/heroku-redis-api)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/velizarn/heroku-redis-api/blob/main/LICENSE)

![Node 16.18.1](https://img.shields.io/badge/node-16.18.1-blueviolet.svg)
![Express 4.18.2](https://img.shields.io/badge/express-4.18.2-yellowgreen.svg)
![Redis 4.3.0](https://img.shields.io/badge/redis-4.3.0-yellowgreen.svg)

## Setup

### Heroku

You can deploy your own copy of the app using the web-based flow:<br />
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/velizarn/heroku-redis-api/tree/main)

Click on "*Deploy to Heroku*" button above and follow the instructions:
* Enter an application name
* Choose a region
* Update config vars or leave default values

You can customize the button, for example you might have the following button URL:
```html
<a href="https://heroku.com/deploy?template=https://github.com/velizarn/heroku-redis-api/tree/main&
env[WHITELIST_IP]=11.11.11.11">Deploy to Heroku</a>
```
This will cause the Heroku app-set interface to prefill IP address for the WHITELIST_IP environment variable and to use specific branch from your repo.

#### Creating an app without a name

*The app name argument is optional. If no app name is specified, a random name will be generated.
Since Heroku app names are in a global namespace, you can expect that common names, like “blog” or “wiki”, will already be taken. It’s often easier to start with a default name and rename the app later.*

### DigitalOcean

You can deploy to DigitalOcean by clicking the button below:<br />
[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/velizarn/heroku-redis-api/tree/main)

### Render

You can deploy to Render.com by clicking the button below:<br />
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
### Scalingo

You can deploy to Scalingo by clicking the button below:<br />
[![Deploy on Scalingo](https://cdn.scalingo.com/deploy/button.svg)](https://my.scalingo.com/deploy?source=https://github.com/velizarn/heroku-redis-api#main)

### Gitpod

Navigate to https://gitpod.io/#https://github.com/velizarn/heroku-redis-api and follow the instructions.
 After installation create .env file in your workspace with following parameters:

```
LOG_LEVEL=info
REDIS_APPKEY_PREFIX=
REDIS_URL=redis://127.0.0.1:6379
WHITELIST_IP=
```
The most important parameter is REDIS_URL. After creating .env file restart the application, if needed.


### Local environment

1) Install Javascript dependencies (via yarn or npm)

2) Create .env file with required params, refer to .env.sample

3) Start the application (npm run start)

## How to use it

### Available endpoints

<dl>
  <dt>GET /help</dt>
    <dd>Displays all available endpoints</dd>
  <dt>GET /info</dt>
    <dd>Returns information and statistics about the server</dd>
  <dt>GET /insomnia.json</dt>
    <dd>Returns data to import a ready-to-use collection into Insomnia Core</dd>
  <dt>GET /keys</dt>
    <dd>Returns all keys, optionally you can set a pattern, e.g. /keys?pattern=name*</dd>
  <dt>GET /get?key=</dt>
    <dd>Get the value of key. If the key does not exist the special value nil is returned. An error is returned if the value stored at key is not a string, because GET only handles string values.</dd>
  <dt>GET /type?key=</dt>
    <dd>Returns the string representation of the type of the value stored at key.</dd>
  <dt>GET /ttl?key=</dt>
    <dd>Returns the remaining time to live of a key that has a timeout.</dd>
  <dt>POST /del</dt>
    <dd>Removes the specified key/s, e.g. keys=foo, keys=foo1,foo2,foo3, etc. A key is ignored if it does not exist.</dd>
</dl>

## License

MIT
