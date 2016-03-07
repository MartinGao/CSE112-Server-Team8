/**
* Created by besin on 2/26/2016.
*/
import mongoose from 'mongoose';
const Business = mongoose.model('Business');

export function createBusiness(req, callback) {
  console.log('createBusiness is running');
  const missing = [];

  if (!req.user) {
    missing.push('userId');
  }
  if (!req.body.businessName) {
    missing.push('businessName');
  }
  if (missing.length) {
    console.log('missing ' + missing.join(', '));
    callback(true, null);
    return;
  }

  Business.findOne({ name: req.body.businessName }).exec((err, business) => {
    if (err) {
      callback(true, { Error: err });
      return;
    }
    if (business) {
      console.log('Duplicated "businessName" field.');
      callback(true, { Error: 'Duplicated "businessName" field.' });
      return;
    }
    console.log('All good. Let save this new business!');

    Business.create({
      name: req.body.businessName,
      logo: req.body.logo,
      url: req.body.url,
      phone: req.body.phone,
      iconURL: req.body.iconURL,
      backgroundImageUrl: req.body.backgroundImageUrl,
      description: req.body.description,
    }, (err1, newBusiness) => {
      if (err1) {
        console.log('newBusiness err1 -> ' + err1);
        callback(true, { Error: err1 });
        return;
      }
      console.log('about to return this new business');
      callback(false, newBusiness);
    });
  })
}

export function getBusiness(req, res) {
  let user = req.user;
  console.log('req.user = ' + user);
  if (!user)
  return res.status(401).send({'Error': "User unauthenticated." });

  var bid = req.query.businessId;
  if (!bid)
  return res.status(400).send({'Error': "Please provide businessId" });

  Business.findOne({ businessId: bid }).exec(function (err, business) {
    if (err)
    return res.status(400).send(err);
    else if (business)
    return res.status(200).send(business);
    else
    return res.status(404).send();
  });
}

export function setBusiness(req, res) {
  var bid = req.body.businessId;

  if (!bid)
  return res.status(400).send({
    'Error': 'Please provide businessId'
  });

  Business.findOne({ businessId: bid }).exec(function (err, business) {
    if (err)
    return res.status(400).send(err);

    if (req.body.userId)
    business.userId = req.body.userId;
    if (req.body.name)
    business.name = req.body.name;
    if (req.body.url)
    business.url = req.body.url;
    if (req.body.phone)
    business.phone = req.body.phone;
    if (req.body.iconURL)
    business.iconURL = req.body.iconURL;
    if (req.body.backgroundImageUrl)
    business.backgroundImageUrl = req.body.backgroundImageUrl;
    if (req.body.userIds)
    business.userIds = req.body.userIds;
    if (req.body.formId)
    business.formId = req.body.formId;
    if (req.body.slackHook)
    business.slackHook = req.body.slackHook;
    business.timeStamp.updated = Date.now();

    business.save(function (err, updatedBusiness) {
      if (err)
      return res.status(400).send(err);
      return res.status(200).send(updatedBusiness);
    });

  });
}

export function _search(req, res, next) {

}
