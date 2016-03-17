import moment from 'moment';
import mongoose from 'mongoose';

const Business = mongoose.model('Business');
const User = mongoose.model('User');

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
    missing.push('missing date_from');
  }
  if (!req.query.date_to) {
    missing.push('missing date_to');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  const dateFrom = moment(req.query.date_from, 'MM-DD-YYYY').toDate();
  const dateTo = moment(req.query.date_to, 'MM-DD-YYYY').toDate();

  Business.find({
    'timeStamp.created': {
      $gte: dateFrom,
      $lte: dateTo,
    },
  })
  .sort('-timeStamp.created')
  .exec((err1, businesses) => {
    if (err1) {
      return res.status(400).send(err1);
    }

    for (let business of businesses) {
      if (business.planLevel === 'basic') {
        retAnalytics.count++;
        retAnalytics.basic.count++;
        if (retAnalytics.basic.timeStamps[moment(business.timeStamp.created)]) {
          retAnalytics.basic.timeStamps[moment(business.timeStamp.created)]
            .count++;
        } else {
          retAnalytics.basic.timeStamps[moment(business.timeStamp.created)]
            .count = 1;
        }
      }
      if (business.planLevel === 'premier') {
        retAnalytics.count++;
        retAnalytics.premier.count++;
        if (retAnalytics.premier.timeStamps[moment(business.timeStamp.created)]) {
          retAnalytics.premier.timeStamps[moment(business.timeStamp.created)]
            .count++;
        } else {
          retAnalytics.premier.timeStamps[moment(business.timeStamp.created)]
            .count = 1;
        }
      }
      if (business.planLevel === 'free') {
        retAnalytics.count++;
        retAnalytics.free.count++;
        if (retAnalytics.free.timeStamps[moment(business.timeStamp.created)]) {
          retAnalytics.free.timeStamps[moment(business.timeStamp.created)]
            .count++;
        } else {
          retAnalytics.free.timeStamps[moment(business.timeStamp.created)]
            .count = 1;
        }
      }
    }

    res.status(200).send(retAnalytics);
  });
}
