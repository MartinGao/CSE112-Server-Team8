/**
* Created by besin on 2/26/2016.
*/
import mongoose from 'mongoose';
const Business = mongoose.model('Business');
const User = mongoose.model('User');
const Form = mongoose.model('Form');

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
    callback({Error: 'missing ' + missing.join(', ')}, null);
    return;
  }

  Business.findOne({ name: req.body.businessName }).exec((err, business) => {
    if (err) {
      callback({ Error: err }, null);
      return;
    }
    if (business) {
      console.log('Duplicated "businessName" field.');
      callback({ Error: 'Duplicated "businessName" field.' }, null);
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
        callback({ Error: err1 }, null);
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

  if (!user) {
    return res.status(401).send({ Error: 'User unauthenticated.' });
  }

  if (!bid) {
    return res.status(400).send({ Error: 'Please provide businessId' });
  }

  Business.findOne({ _id: bid }).exec(function (err, business) {
    if (err) {
      return res.status(400).send(err);
    }
    if (business) {
      console.log("formId = " + business.formId);
      if (business.formId)
        Form.findOne({_id: business.formId}).exec(function (err, form) {
          return res.status(200).send({business: business, form: form});
        });
      else
        return res.status(200).send({business: business, form: null});
    }
    else
      return res.status(404).send();
  });
}

export function setBusiness(req, res) {
  const bid = req.body.businessId;

  if (!bid) {
    return res.status(400).send({ Error: 'Please provide businessId' });
  }

  Business.findOne({ _id: bid }).exec(function (err, business) {
    if (err) {
      return res.status(400).send(err);
    }

    if (business == null)
      return res.status(404).end();

    if (req.body.userId) {
      business.userId = req.body.userId;
    }
    if (req.body.name) {
      business.name = req.body.name;
    }
    if (req.body.planLevel) {
      business.planLevel = req.body.planLevel;
    }
    if (req.body.url) {
      business.url = req.body.url;
    }
    if (req.body.phone) {
      business.phone = req.body.phone;
    }
    if (req.body.iconURL) {
      business.iconURL = req.body.iconURL;
    }
    if (req.body.backgroundImageUrl) {
      business.backgroundImageUrl = req.body.backgroundImageUrl;
    }
    if (req.body.userIds) {
      business.userIds = req.body.userIds;
    }
    if (req.body.formId) {
      business.formId = req.body.formId;
    }
    if (req.body.slackHook) {
      business.slackHook = req.body.slackHook;
    }

    business.timeStamp.updated = Date.now();

    business.save(function (err1, updatedBusiness) {
      if (err1) {
        return res.status(400).send(err);
      }
      return res.status(200).send(updatedBusiness);
    });
  });
}


export function suspendBusiness(req, res) {
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === -2 || existedUser.role === -1) {
          Business.findOneAndUpdate({
            _id: req.body.businessId,
          }, {
            suspended: req.body.suspended,
          }, {
            new: true,
          }, (err1, updatedUser) => {
            if (updatedUser) {
              res.status(200).send(updatedUser);
            } else {
              res.status(400).send(err1);
            }
          });
        } else {
          const temp = 'Permission denied! Require -2 (Venkman) or -1(Venkman Support)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function listBusiness(req, res) {
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === -2 || existedUser.role === -1) {
          Business.find().exec((err1, businesses) => {
            if (businesses) {
              res.status(200).send(businesses);
            } else {
              res.status(400).send(err1);
            }
          });
        } else {
          const temp = 'Permission denied! Require -2 (Venkman) or -1(Venkman Support)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}
/*
export function _search(req, res, next) {
  TODO
}
*/
