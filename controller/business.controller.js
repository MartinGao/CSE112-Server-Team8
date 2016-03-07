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
      planLevel: req.body.planLevel,
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
  });
}

export function getBusiness(req, res) {
  const user = req.user;
  const bid = req.query.businessId;

  console.log('req.user = ' + user);
  if (!user) {
    return res.status(401).send({ Error: 'User unauthenticated.' });
  }

  if (!bid) {
    return res.status(400).send({ Error: 'Please provide businessId' });
  }

  Business.findOne({ businessId: bid }).exec(function (err, business) {
    if (err) {
      return res.status(400).send(err);
    }
    if (business) {
      return res.status(200).send(business);
    }
    return res.status(404).send();
  });
}

export function setBusiness(req, res) {
  const bid = req.body.businessId;

  if (!bid) {
    return res.status(400).send({ Error: 'Please provide businessId' });
  }

  Business.findOne({ businessId: bid }).exec(function (err, business) {
    if (err) {
      return res.status(400).send(err);
    }

    if (req.body.userId) {
      Business.userId = req.body.userId;
    }
    if (req.body.name) {
      Business.name = req.body.name;
    }
    if (req.body.planLevel) {
      Business.planLevel = req.body.planLevel;
    }
    if (req.body.url) {
      Business.url = req.body.url;
    }
    if (req.body.phone) {
      Business.phone = req.body.phone;
    }
    if (req.body.iconURL) {
      Business.iconURL = req.body.iconURL;
    }
    if (req.body.backgroundImageUrl) {
      Business.backgroundImageUrl = req.body.backgroundImageUrl;
    }
    if (req.body.userIds) {
      Business.userIds = req.body.userIds;
    }
    if (req.body.formId) {
      Business.formId = req.body.formId;
    }
    if (req.body.slackHook) {
      Business.slackHook = req.body.slackHook;
    }

    Business.timeStamp.updated = Date.now();

    business.save(function (err1, updatedBusiness) {
      if (err1) {
        return res.status(400).send(err);
      }
      return res.status(200).send(updatedBusiness);
    });
  });
}
/*
export function _search(req, res, next) {
  TODO
}
*/
