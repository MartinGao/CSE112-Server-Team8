import mongoose from 'mongoose';
import moment from 'moment';
import Chance from 'chance';
import Pusher from 'pusher';

const Visitor = mongoose.model('Visitor');
const User = mongoose.model('User');
const chance = new Chance();
const pusher = new Pusher({
  appId: '173148',
  key: '7c84af4dd6941414d752',
  secret: '3bd44e5f7d1d9724385d',
  encrypted: true,
});
pusher.port = 443;


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


export function newVisitor(req, res) {

  var missing = [];
  if (!req.body.name)
    missing.push("missing name");
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  User.findById(req.user, function(err, user) {
    if (err)
      return res.status(400).send(err);
    if (user) {
      var newVisitor = new Visitor();
      newVisitor.name = req.body.name;
      newVisitor.businessId = user.business;
      newVisitor.email = req.body.email || null;
      newVisitor.phone = req.body.phone || null;
      newVisitor.form = req.body.form || null;

      if (req.body.requireCheckOff === '0')
        newVisitor.checkOff = new Date();
      newVisitor.save(function(err, updatedVisitor) {
        if (err)
          return res.status(400).send(err);
        return res.status(200).send(updatedVisitor);
      });
    }
  });
}

export function checkOffVisitor(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    if (err)
      return res.status(400).send(err);
    if (user) {
      Visitor.findOne({_id:req.params.visitorId, businessId: user.business}).exec(function(err, visitor) {
        console.log(visitor);
        if (err)
          return res.status(400).send(err);
        if (visitor) {
          visitor.checkOff = new Date();
          console.log(visitor);
          visitor.save(function(err, updatedVisitor) {
            if (err)
              return res.status(400).send(err);
            return res.status(200).send(updatedVisitor);
          });
        }
      });
    }
  });
}

export function getQueue(req, res, next) {
  var missing = [];
  if (!req.query.page)
    missing.push("missing page");
  if (req.query.page < 1)
    missing.push("page is less than 1");
  if (!req.query.per_page)
    missing.push("missing per_page");
  if (req.query.per_page < 1)
    missing.push("per_page is less than 1");
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  User.findById(req.user._id, function(err, user) {
    if (err)
      return res.status(400).send(err);
    if (user) {
      Visitor.find({businessId: user.business, checkOff: null})
      .sort('-timeStamp.created')
      .skip((req.query.page - 1) * req.query.per_page)
      .limit(req.query.per_page)
      .exec(function (err, visitors) {
        if (err)
          return res.status(400).send(err);
        return res.status(200).send(visitors);
      });
    }
  });
}

export function getVisitors(req, res, next) {
  var missing = [];
  if (!req.query.page)
    missing.push("missing page");
  if (req.query.page < 1)
    missing.push("page is less than 1");
  if (!req.query.per_page)
    missing.push("missing per_page");
  if (req.query.per_page < 1)
    missing.push("per_page is less than 1");
  if (!req.query.date)
    missing.push("missing date");
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  var startDate = moment(req.query.date, 'MM-DD-YYYY').toDate();
  var endDate = moment(req.query.date, 'MM-DD-YYYY').add(1, 'days').toDate();

  User.findById(req.user._id, function(err, user) {
    if (err)
      return res.status(400).send(err);
    if (user) {
      Visitor.find({
        business: user.businessId,
        checkOff: {$ne: null},
        checkIn: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort('-timeStamp.created')
      .skip((req.query.page - 1) * req.query.per_page)
      .limit(req.query.per_page)
      .exec(function (err, visitors) {
        if (err)
          return res.status(400).send(err);
        return res.status(200).send(visitors);
      });
    }
  });
}

export function deleteVisitor(req, res, next) {
  if (!req.params.visitorId)
    res.status(400).send(err);

  User.findById(req.user._id, function(err, user) {
    if (err)
      return res.status(400).send(err);
    if (user) {
      Visitor.findOneAndRemove({_id:req.params.visitorId, businessId:user.business}).exec(function(err, visitor) {
        if (err)
          return res.status(400).send(err);
        return res.status(200).send({"Success":"visitor removed"});
      });
    }
  });
}

export function search(req, res, next) {
  //next week
}



//here be shit code

  // Visitor.find({name: req.body.name})
  // .and(
  //   [
  //     {$or:
  //       [
  //         {phone: req.body.phone},
  //         {email: req.body.email}
  //       ]
  //     }
  //   ]).exec(function(err, visitor) {
  //   if (err)
  //     return res.status(400).send(err);
  //   if (visitor) {
  //     //will be replaced with either pushing ot not pushing to queue
  //     visitor.checkIns.push(new Date());
  //     if (!req.body.requireCheckOff)
  //       visitor.checkOffs.push(new Date());
  //     if (req.body.form)
  //       visitor.push(req.body.form);
  //     visitor.save(function(err, updatedVisitor) {
  //       if (err)
  //         return res.status(400).send(err);
  //       return res.status(200).send(updatedVisitor);
  //     });
  //   }
  // });
