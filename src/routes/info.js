'use strict';

const rParams = [
  'redis_version',
  'redis_mode',
  'os',
  'process_id',
  'run_id',
  'tcp_port',
  'uptime_in_seconds',
  'uptime_in_days',
  'connected_clients',
  'blocked_clients',
  'used_memory_human',
  'used_memory_peak_human',
  'maxmemory_human',
  'maxmemory_policy',
  'total_connections_received',
  'total_commands_processed',
  'expired_keys',
  'evicted_keys',
  'role',
  'connected_slaves'
];

module.exports = (app, redisClient) => {

  app.get('/info', async (req, res, next) => {

    try {

      const
        data = {},
        redisInfo = await redisClient.info('all');

      redisInfo.split('\n').forEach((ln) => {
        const found = ln.match(/^([a-z_0-9]+):([^:]+)$/);
        if (found !== null && found.length > 0) {
          if (rParams.includes(found[1])) {
            data[found[1]] = found[2].trim();
          }
        }
      });

      res.send(data);

    } catch (err) {
      next(err);
    }
  });
};
