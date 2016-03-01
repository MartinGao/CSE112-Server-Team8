import mongoose from 'mongoose';
import moment from 'moment';
var Visitor = mongoose.model('Visitor');

export function newVisitor(req, res, next) {

  console.log(req.user._id);

  var businessId = "56a2089878a6daf9919a919f";

  //query for user to get businessId

  var missing = [];
  if (!req.body.name)
    missing.push("missing name");
  if (!businessId)
    missing.push("missing businessId");
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  var newVisitor = new Visitor();
  newVisitor.name = req.body.name;
  newVisitor.businessId = businessId;
  newVisitor.email = req.body.email || null;
  newVisitor.phone = req.body.phone || null;
  newVisitor.form = req.body.form || null;

  if (req.body.requireCheckOff === '0'){
    newVisitor.checkOff = new Date();
 }
  newVisitor.save(function(err, updatedVisitor) {
    if (err)
      return res.status(400).send(err);
    return res.status(200).send(updatedVisitor);
  });
}

export function checkOffVisitor(req, res, next) {

  var businessId = 1;
  var visitorId = req.params.visitorId;

  Visitor.findById(visitorId, function(err, visitor) {
    if (err)
      return res.status(400).send(err);
    if (visitor) {
      if (visitor.businessId != businessId)
        return res.status(400).send({"Error":"incorrect businessId"});
      visitor.checkOff = new Date();
      visitor.save(function(err, updatedVisitor) {
        if (err)
          return res.status(400).send(err);
        return res.status(200).send(updatedVisitor);
      });
    }
  });
}

export function getQueue(req, res, next) {
  var businessId = "56a2089878a6daf9919a919f";

  var missing = [];
  if (!req.query.page)
    missing.push("missing page or page is 0");
  if (!req.query.per_page)
    missing.push("missing per_page or per_page is 0");
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  Visitor.find({businessId: businessId, checkOff: null})
  .sort('-timeStamp.created')
  .skip((req.query.page - 1) * req.query.per_page)
  .limit(req.query.per_page) 
  .exec(function (err, visitors) {
    if (err)
      return res.status(400).send(err);
    return res.status(200).send(visitors);
  });
}

export function getVisitors(req, res, next) {
  var businessId = "56a2089878a6daf9919a919f";

  var missing = [];
  if (!req.query.page)
    missing.push("missing page or page is 0");
  if (!req.query.per_page)
    missing.push("missing per_page or per_page is 0");
  if (!req.query.date)
    missing.push("missing date");
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  var startDate = moment(req.query.date, 'MM-DD-YYYY').toDate();
  var endDate = moment(req.query.date, 'MM-DD-YYYY').add(1, 'days').toDate();

  Visitor.find({
    businessId: businessId, 
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

export function deleteVisitor(req, res, next) {
  var businessId = "56a2089878a6daf9919a919f";
  var visitorId = req.params.visitorId;
  console.log(visitorId);

  Visitor.findOneAndRemove({_id:visitorId, businessId:businessId}).exec(function(err, visitor) {
    if (err)
      return res.status(400).send(err);
    return res.status(404).send({"Success":"visitor removed"});
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
