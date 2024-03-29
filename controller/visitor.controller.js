import mongoose from 'mongoose';
import moment from 'moment';
import Chance from 'chance';
import Pusher from 'pusher';
import request from 'request';
import winston from 'winston';
import 'winston-loggly';
const Visitor = mongoose.model('Visitor');
const Business = mongoose.model('Business');
const User = mongoose.model('User');
const chance = new Chance();
const pusher = new Pusher({
  appId: '173148',
  key: '7c84af4dd6941414d752',
  secret: '3bd44e5f7d1d9724385d',
  encrypted: true,
});
pusher.port = 443;
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

export function testPusher(req, res) {
  let randomName = chance.name();
  if (req.query.name) {
    randomName = req.query.name;
  }
  pusher.trigger('test_channel', 'newVisitor', {
    visitorName: randomName,
  });
  res.status(200).send({ visitorName: randomName });
}

export function createVisitor(req, res) {
  const missing = [];
  if (!req.body.name) {
    logger.error('createVisitor attempt failed: missing name');
    missing.push('missing name');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  User.findById(req.user, (err, user) => {
    if (err) {
      logger.error('Error occurred on visitor checkin: ' + err);

      return res.status(400).send(err);
    }
    if (user) {
      const newVis = new Visitor();
      newVis.name = req.body.name;
      newVis.businessId = user.business;
      newVis.email = req.body.email || null;
      newVis.phone = req.body.phone || null;
      newVis.form = req.body.form || null;

      if (req.body.requireCheckOff === '0') {
        newVis.checkOff = new Date();
      }

      newVis.save((err1, savedVisitor) => {
        if (err1) {
          res.status(400).send(err1);
        } else {
          logger.info(newVis.name + ' has checked in');
          pusher.trigger(user.business.toString(), 'newVisitor', savedVisitor);

          Business.findOne({ _id: user.business }).exec((err2, businessOfUser) => {
            if (err2) {
              logger.error('Error 2 occured on visitor checkin ' + err2);
            } else {
              const payload = {
                text: req.body.name + ' has checked in!',
              };
              request({
                method: 'POST',
                // url: 'https://hooks.slack.com/services/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',
                url: businessOfUser.slackHook,
                form: {
                  payload: JSON.stringify(payload),
                },
              }, (_error, _response1, _body1) => {
              });
            }
          });

          res.status(200).send(savedVisitor);
        }
      });
    } else {
      logger.error('Error occurred on visitor checkin: User does not exist!');
      res.status(400).send({
        Error: 'User does not exist!',
      });
    }
  });
}


export function checkOffVisitor(req, res) {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      logger.error('Error occurred on visitor checkoff ' + err);
      return res.status(400).send(err);
    }
    if (user) {
      Visitor.findOne({ _id: req.params.visitorId, businessId: user.business })
      .exec((err1, visitor) => {
        if (err1) {
          return res.status(400).send(err);
        }
        if (visitor) {
          visitor.checkOff = new Date();
          visitor.save((err2, updatedVisitor) => {
            if (err2) {
              logger.error('Error 2 occurred on visitor checkoff ' + err2);
              return res.status(400).send(err);
            }
            logger.info(visitor.name + ' has been checked off');
            pusher.trigger(user.business.toString(), 'checkOffVisitor', updatedVisitor);
            return res.status(200).send(updatedVisitor);
          });
        }
      });
    }
  });
}

export function getQueue(req, res) {
  const missing = [];

  if (!req.user) {
    return res.status(401).end();
  }
  if (!req.query.page) {
    missing.push('missing page');
  }
  if (req.query.page < 1) {
    missing.push('page is less than 1');
  }
  if (!req.query.per_page) {
    missing.push('missing per_page');
  }
  if (req.query.per_page < 1) {
    missing.push('per_page is less than 1');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  User.findById(req.user._id, (err, user) => {
    if (err) {
      logger.error('Queue fetching user faced error');
      return res.status(400).send(err);
    }
    if (user) {
      Visitor.find({ businessId: user.business, checkOff: null })
      .sort('-timeStamp.created')
      .skip((req.query.page - 1) * req.query.per_page)
      .limit(req.query.per_page)
      .exec((err1, visitors) => {
        if (err1) {
          return res.status(400).send(err);
        }
        return res.status(200).send(visitors);
      });
    } else {
      return res.status(404).end();
    }
  });
}

export function getVisitors(req, res) {
  const missing = [];
  if (!req.query.page) {
    missing.push('missing page');
  }
  if (req.query.page < 1) {
    missing.push('page is less than 1');
  }
  if (!req.query.per_page) {
    missing.push('missing per_page');
  }
  if (req.query.per_page < 1) {
    missing.push('per_page is less than 1');
  }
  if (!req.query.date) {
    missing.push('missing date');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  const startDate = moment(req.query.date, 'MM-DD-YYYY').toDate();
  const endDate = moment(req.query.date, 'MM-DD-YYYY').add(1, 'days').toDate();

  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (user) {
      Visitor.find({
        businessId: user.business,
        checkOff: { $ne: null },
        checkIn: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort('-timeStamp.created')
      .skip((req.query.page - 1) * req.query.per_page)
      .limit(req.query.per_page)
      .exec((err1, visitors) => {
        if (err1) {
          return res.status(400).send(err1);
        }
        return res.status(200).send(visitors);
      });
    }
  });
}

export function deleteVisitor(req, res) {
  if (!req.params.visitorId) {
    logger.error('Error occurred when deleting visitor: no visitorId');
    res.status(400).send({ Error: 'no visitorId' });
  }

  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (user) {
      Visitor.findOneAndRemove({ _id: req.params.visitorId,
        businessId: user.business }).exec((err1) => {
          if (err1) {
            return res.status(400).send(err);
          }
          return res.status(200).send({ Success: 'visitor removed' });
        });
    }
  });
}

export function searchVisitor(req, res) {
  if (!req.user) {
    return res.status(401).end();
  }

  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(400).send(err);
    if (user) {
      Visitor
      .find(
        {
          name: new RegExp(req.query.term, 'i'),
          businessId: user.business,
        })
      .exec((err1, results) => {
        if (err1) return res.status(400).send(err);
        res.status(200).send(results);
      });
    }
  });
}

export function searchUser(req, res) {
  if (!req.user) {
    logger.error('searchUser error');
    return res.status(401).end();
  }

  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(400).send(err);
    if (user) {
      User
      .find(
        {
          name: new RegExp(req.query.term, 'i'),
          business: user.business,
        })
      .exec((err1, results) => {
        if (err1) return res.status(400).send(err);
        res.status(200).send(results);
      });
    }
  });
}
