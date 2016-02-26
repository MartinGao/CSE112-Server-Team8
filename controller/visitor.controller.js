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

  Visitor.findOne({name: req.body.name}).exec(function(err, visitor) {
    if (err)
      return res.status(400).send(err);
    if (visitor) {
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
  newVisitor.checkIns.push(new Date());
  if (!req.body.requireCheckOff)
   newVisitor.checkOffs.push(new Date());
  newVisitor.save(function(err, updatedVisitor) {
    if (err)
      return res.status(400).send(err);
    return res.status(200).send(updatedVisitor);
  });
}

export function _checkOffVisitor(req, res, next) {

}

export function _search(req, res, next) {

}
