import mongoose from 'mongoose';
var Visitor = mongoose.model('Visitor');

export function newVisitor(req, res, next) {
  var missing = [];
  console.log(req);
  if (!req.body.name)
    missing.push("missing name");
  if (!req.body.businessId)
    missing.push("need bussinesID")
  if (missing.length) {
    return res.status(400).send({
      "Error": missing.join(', ')
    });
  }

  //need to implement security

  Visitor.find({name: req.body.name})
  .and(
    [
      {$or:
        [
          {phone: req.body.phone},
          {email: req.body.email}
        ]
      }
    ]).exec(function(err, visitor) {
    if (err)
      return res.status(400).send(err);
    if (visitor) {
      //will be replaced with either pushing ot not pushing to queue 
      visitor.checkIns.push(new Date());
      if (!req.body.requireCheckOff)
        visitor.checkOffs.push(new Date());
      if (req.body.form)
        visitor.push(req.body.form);
      visitor.save(function(err, updatedVisitor) {
        if (err)
          return res.status(400).send(err);
        return res.status(200).send(updatedVisitor);
      });
    }
  });

  var newVisitor = new Visitor();
  newVisitor.name = req.body.name;
  newVisitor.email = req.body.email || null;
  newVisitor.phone = req.body.phone || null;
  if (req.body.form)
    newVisitor.push(req.body.form);
  //will change when we figure out how to do queue
  newVisitor.checkIns.push(new Date());
  if (!req.body.requireCheckOff)
   newVisitor.checkOffs.push(new Date());
  newVisitor.save(function(err, updatedVisitor) {
    if (err)
      return res.status(400).send(err);
    return res.status(200).send(updatedVisitor);
  });
}

export function checkOffVisitor(req, res, next) {
  //will happen when we get queue
}

export function search(req, res, next) {
  //next week
}

export function deleteVisitor(req, res, next) {
  //need to implement security

  var visitorId = req.query.id;

  Visitor.findById(visitorId, function(err, visitor) {
    if (err)
      return res.status(500).send(err);
    if (visitor)
      visitor.remove(function(err) {
        if (err)
          return res.status(500).send(err);
        return res.status(200).end();
      });
  });

}
