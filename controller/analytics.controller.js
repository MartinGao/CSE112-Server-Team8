import moment from 'moment';
import mongoose from 'mongoose';
import winston from 'winston';
import 'winston-loggly';

const Business = mongoose.model('Business');
const Visitor = mongoose.model('Visitor');
const User = mongoose.model('User');
const logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Loggly)({
      level: 'debug',
      json: true,
      inputToken: '8b1c41e3-1818-4595-a284-8f3675678a98',
      subdomain: 'phoenixsol',
    }),
  ],
});

export function getVisitorAnalytics(req, res) {
  const missing = [];
  const retAnalytics =
    {
      count: 0,
      visitors: {
        count: 0,
        timeStamps: {},
      },
    };

  if (!req.query.date_from) {
    logger.error('getVisitorAnalytics Error: missing date_from');
    missing.push('missing date_from');
  }
  if (!req.query.date_to) {
    logger.error('getVisitorAnalytics Error: missing date_to');
    missing.push('missing date_to');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  const dateFrom = moment(req.query.date_from, 'MM-DD-YYYY').toDate();
  const dateTo = moment(req.query.date_to, 'MM-DD-YYYY').add(1, 'day').toDate();

  User.findById(req.user._id, (err, user) => {
    if (err) {
      logger.error('getVisitorAnalytics Error: ' + err);
      return res.status(400).send(err);
    }
    if (user) {
      Visitor.find({
        businessId: user.business,
        'timeStamp.created': {
          $gte: dateFrom,
          $lte: dateTo,
        },
      })
      .sort('-timeStamp.created')
      .exec((err1, visitors) => {
        if (err1) {
          logger.error('getVisitorAnalytics Error: ' + err1);
          return res.status(400).send(err1);
        }
        const parseVisitors = (visitor) => {
          retAnalytics.count++;
          if (retAnalytics.visitors.timeStamps[moment(visitor.timeStamp.created)
            .format('MM-DD-YYYY')]) {
            retAnalytics.visitors.timeStamps[moment(visitor.timeStamp.created)
              .format('MM-DD-YYYY')]
              .count++;
          } else {
            retAnalytics.visitors.timeStamps[moment(visitor.timeStamp.created)
              .format('MM-DD-YYYY')] = {};
            retAnalytics.visitors.timeStamps[moment(visitor.timeStamp.created)
              .format('MM-DD-YYYY')]
              .count = 1;
          }
        };

        for (let visit of visitors) {
          parseVisitors(visit);
        }
        logger.info('getVisitorAnalytics successful!');
        return res.status(200).send(retAnalytics);
      });
    }
  });
}

export function getUserAnalytics(req, res) {
  const missing = [];
  const retAnalytics =
    {
      count: 0,
      basic: {
        count: 0,
        timeStamps: {},
      },
      premier: {
        count: 0,
        timeStamps: {},
      },
      free: {
        count: 0,
        timeStamps: {},
      },
    };
  if (!req.query.date_from) {
    logger.error('getUserAnalytics Error: missing date_from');
    missing.push('missing date_from');
  }
  if (!req.query.date_to) {
    logger.error('getUserAnalytics Error: missing date_to');
    missing.push('missing date_to');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  const dateFrom = moment(req.query.date_from, 'MM-DD-YYYY').toDate();
  const dateTo = moment(req.query.date_to, 'MM-DD-YYYY').add(1, 'day').toDate();

  Business.find({
    'timeStamp.created': {
      $gte: dateFrom,
      $lte: dateTo,
    },
  })
  .sort('-timeStamp.created')
  .exec((err1, businesses) => {
    if (err1) {
      logger.error('getUserAnalytics Error: ' + err1);
      return res.status(400).send(err1);
    }

    const parseAnalytics = (type, business) => {
      retAnalytics.count++;
      retAnalytics[type].count++;
      if (retAnalytics[type].timeStamps[moment(business.timeStamp.created)
        .format('MM-DD-YYYY')]) {
        retAnalytics[type].timeStamps[moment(business.timeStamp.created)
          .format('MM-DD-YYYY')]
          .count++;
      } else {
        retAnalytics[type].timeStamps[moment(business.timeStamp.created)
          .format('MM-DD-YYYY')] = {};
        retAnalytics[type].timeStamps[moment(business.timeStamp.created)
          .format('MM-DD-YYYY')]
          .count = 1;
      }
    };

    for (let business of businesses) {
      if (business.planLevel === 'basic') {
        parseAnalytics('basic', business);
      }
      if (business.planLevel === 'premier') {
        parseAnalytics('premier', business);
      }
      if (business.planLevel === 'free') {
        parseAnalytics('free', business);
      }
    }
    logger.info('getUserAnalytics successful!');
    return res.status(200).send(retAnalytics);
  });
}
