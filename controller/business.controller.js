/**
* Created by besin on 2/26/2016.
*/
import mongoose from 'mongoose';
const Business = mongoose.model('Business');
const User = mongoose.model('User');

const fitnessForm = JSON.stringify([{"id":"name","component":"textInput","editable":false,"index":0,"label":"Name","description":"Your full name, or your nickname.","placeholder":"Jane Doe","options":[],"required":true,"validation":"/.*/","$$hashKey":"object:59"},{"id":"email","component":"textInput","editable":true,"index":1,"label":"Email","description":"Your private email, we won't spam you!","placeholder":"janedoe@gmail.com","options":[],"required":false,"validation":"[email]","$$hashKey":"object:60"},{"id":"phone","component":"textInput","editable":true,"index":2,"label":"Phone","description":"Your phone number.","placeholder":"8581234567","options":[],"required":false,"validation":"/.*/","$$hashKey":"object:158"},{"id":"employee","component":"select","editable":true,"index":3,"label":"Fitness Instructor","description":"Who are you seeing today?","placeholder":"placeholder","options":["Any instructor is fine"],"required":false,"validation":"/.*/","$$hashKey":"object:61"}]);
const healthForm = JSON.stringify([{"id":"name","component":"textInput","editable":false,"index":0,"label":"Name","description":"Your full name, or your nickname.","placeholder":"Jane Doe","options":[],"required":true,"validation":"/.*/","$$hashKey":"object:59"},{"id":"email","component":"textInput","editable":true,"index":1,"label":"Email","description":"Your private email, we won't spam you!","placeholder":"janedoe@gmail.com","options":[],"required":false,"validation":"[email]","$$hashKey":"object:60"},{"id":"phone","component":"textInput","editable":true,"index":2,"label":"Phone","description":"Your phone number.","placeholder":"8581234567","options":[],"required":false,"validation":"/.*/","$$hashKey":"object:158"},{"id":"employee","component":"select","editable":true,"index":3,"label":"Physician","description":"Who are you seeing today?","placeholder":"placeholder","options":["Anyone is fine"],"required":false,"validation":"/.*/","$$hashKey":"object:61"}]);
const otherForm = JSON.stringify([{"id":"name","component":"textInput","editable":false,"index":0,"label":"Name","description":"Your full name, or your nickname.","placeholder":"Jane Doe","options":[],"required":true,"validation":"/.*/","$$hashKey":"object:59"},{"id":"email","component":"textInput","editable":true,"index":1,"label":"Email","description":"Your private email, we won't spam you!","placeholder":"janedoe@gmail.com","options":[],"required":false,"validation":"[email]","$$hashKey":"object:60"},{"id":"phone","component":"textInput","editable":true,"index":2,"label":"Phone","description":"Your phone number.","placeholder":"8581234567","options":[],"required":false,"validation":"/.*/","$$hashKey":"object:158"},{"id":"employee","component":"select","editable":true,"index":3,"label":"Employee","description":"Who are you seeing today?","placeholder":"placeholder","options":["Anyone is fine"],"required":false,"validation":"/.*/","$$hashKey":"object:61"}]);

export function createBusiness(req, callback) {
  let formType;
  console.log('createBusiness is running');
  const missing = [];

  if (req.body.businessType === 'fitness') {
    formType = fitnessForm;
  } else if (req.body.businessType === 'health') {
    formType = healthForm;
  } else {
    formType = otherForm;
  }

  if (!req.user) {
    missing.push('userId');
  }
  if (!req.body.businessName) {
    missing.push('businessName');
  }
  if (missing.length) {
    callback({ Error: 'missing ' + missing.join(', ') }, null);
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
      numEmployees: req.body.numEmployees || 1,
      businessType: req.body.businessType,
      logo: req.body.logo,
      url: req.body.url,
      phone: req.body.phone,
      iconURL: req.body.iconURL,
      backgroundImageUrl: req.body.backgroundImageUrl,
      form: formType,
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
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (user) {
      Business.findOne({ _id: user.business }).exec((err1, business) => {
        if (err1) {
          return res.status(400).send(err1);
        }
        if (business) {
          return res.status(200).send(business);
        }
      });
    }
  });
}

export function setBusiness(req, res) {
  const updatedFields = {};

  if (req.body.userId) {
    updatedFields.userId = req.body.userId;
  }
  if (req.body.name) {
    updatedFields.name = req.body.name;
  }
  if (req.body.planLevel) {
    updatedFields.planLevel = req.body.planLevel;
  }
  if (req.body.numEmployees) {
    updatedFields.numEmployees = req.body.numEmployees;
  }
  if (req.body.url) {
    updatedFields.url = req.body.url;
  }
  if (req.body.phone) {
    updatedFields.phone = req.body.phone;
  }
  if (req.body.iconURL) {
    updatedFields.iconURL = req.body.iconURL;
  }
  if (req.body.backgroundImageUrl) {
    updatedFields.backgroundImageUrl = req.body.backgroundImageUrl;
  }
  if (req.body.userIds) {
    updatedFields.userIds = req.body.userIds;
  }
  if (req.body.businessType) {
    updatedFields.businessType = req.body.businessType;
  }
  if (req.body.form) {
    updatedFields.form = JSON.stringify(req.body.form);
  }
  if (req.body.slackHook) {
    updatedFields.slackHook = req.body.slackHook;
  }

  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (user) {
      Business.findOneAndUpdate({
        _id: user.business,
      }, {
        $set: updatedFields,
      }, {
        new: true,
      }, (err1, updatedBusiness) => {
        if (err1) {
          return res.status(400).send(err1);
        }
        if (updatedBusiness) {
          return res.status(200).send(updatedBusiness);
        }
      });
    } else {
      return res.status(400).send({ Error: 'Invalid userId' });
    }
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
