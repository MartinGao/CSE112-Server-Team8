var winston = require('winston');
require('winston-loggly');

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.File)({
      filename: './logs/logs.log',
      level: 'debug'
    }), 
    new(winston.transports.Loggly)({
      level: 'debug',
      json: true,
      inputToken: '8b1c41e3-1818-4595-a284-8f3675678a98',
      subdomain: 'phoenixsol' 
    })
  ]
});

logger.info('test');
