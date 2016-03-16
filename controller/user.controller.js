import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import * as BusinessController from './business.controller';
const User = mongoose.model('User');


const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';


export function currentUser(req, res) {
  User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        res.status(200).send(existedUser);
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function signIn(req, res) {
  User.findOne({
    email: req.body.email,
  }, (err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      // Email Exists
      if (existedUser) {
        if (bcrypt.compareSync(req.body.password, existedUser.password)) {
          res.status(200).send({
            token: jwt.sign({
              _id: existedUser._id,
            }, JWT_SECRET),
            user: existedUser,
          });
        } else {
          res.status(401).send({ errorMsg: 'Invalid Password!' });
        }
      } else {
        res.status(401).send({ errorMsg: 'Invalid Email!' });
      }
    }
  });
}

export function ownerSignUp(req, res) {

  if (!req.body.name) {
    return res.status(400).send({ errorMsg: 'Missing "name" field' });
  }
  if (!req.body.password) {
    return res.status(400).send({ errorMsg: 'Missing "password" field' });
  }
  if (!req.body.phone) {
    return res.status(400).send({ errorMsg: 'Missing "phone" field' });
  }
  if (!req.body.email) {
    return res.status(400).send({ errorMsg: 'Missing "email" field' });
  }

  var user = new User();
  req.user = user;
  BusinessController.createBusiness(req, (err, newBusiness) => {
    if (err) {
      res.status(400).send(err);
    } else {
      const saltsalt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, saltsalt);
      user.role = 2;
      user.approved = true;
      user.name = req.body.name;
      user.avatar = req.body.avatar;
      user.email = req.body.email;
      user.password = hash;
      user.salt = saltsalt;
      user.phone = req.body.phone;
      user.business = newBusiness._id;
      user.token = bcrypt.genSaltSync(32);
      user.tokenExpiredAt = moment().add(1, 'years');
      user.save({
        role: 2,
        approved: true,
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
        salt: saltsalt,
        business: newBusiness._id,
        token: bcrypt.genSaltSync(32),
        tokenExpiredAt: moment().add(1, 'years')
      }, (err1, newUser) => {
        if (err1) {
          console.log('_createManagerUser error! -> ' + err1);
          res.status(400).send(err1);
        } else {
          console.log('Hello New User! ' + newUser );
          res.status(200).send({
            token: jwt.sign({
              _id: newUser._id
            }, JWT_SECRET),
            user: newUser
          });
        }
      });
    }
  });
}

export function listEmployees(req, res) {
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === 2 || existedUser.role === 1) {
          User.find({
            business: existedUser.business,
          }).exec((err1, employees) => {
            if (err) {
              res.status(400).send(err);
            } else {
              res.status(200).send(employees);
            }
          });
        } else {
          const temp = 'Permission denied! Require Role 1 (Employee Admin) or 2 (Business Owner)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function updateUser(req, res) {
  const setObj = {};
  if (req.body.name) {
    setObj.name = req.body.name;
  }
  if (req.body.avatar) {
    setObj.avatar = req.body.avatar;
  }
  if (req.body.phone) {
    setObj.phone = req.body.phone;
  }
  if (req.body.email) {
    setObj.email = req.body.email;
  }
  if (req.body.receiveSMS || req.body.receiveEmail || req.body.theme) {
    setObj.settings = {};
    if (req.body.receiveSMS) {
      setObj.settings.receiveSMS = req.body.receiveSMS;
    }
    if (req.body.receiveEmail) {
      setObj.settings.receiveEmail = req.body.receiveEmail;
    }
    if (req.body.receiveBrowserNotification) {
      setObj.settings.receiveBrowserNotification = req.body.receiveBrowserNotification;
    }
    if (req.body.theme) {
      setObj.settings.theme = req.body.theme;
    }
  }

  User.findOneAndUpdate({
    _id: req.user._id,
  }, {
    $set: setObj,
  }, {
    new: true,
  }, (err, updatedUser) => {
    if (err) {
      console.log('WTF');
      res.status(400).send(err);
    } else {
      if (updatedUser) {
        res.status(200).send(updatedUser);
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function changePassword(req, res) {
  const missing = [];

  if (!req.body.oldPassword) {
    missing.push('oldPassword');
  }
  if (!req.body.newPassword) {
    missing.push('newPassword');
  }
  if (missing.length) {
    res.status(400).send({ Error: 'missing ' + missing.join(', ') });
    return;
  }
  User.findOne({
    _id: req.user._id,
  }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (bcrypt.compareSync(req.body.oldPassword, existedUser.password)) {
          const saltsalt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.newPassword, saltsalt);
          User.findOneAndUpdate({
            _id: req.user._id,
          }, {
            password: hash,
            salt: saltsalt,
            approved: true,
          }, {
            new: true,
          }, (err1, updatedUser) => {
            if (updatedUser) {
              res.status(200).send(updatedUser);
            } else {
              res.status(400).send({ errorMsg: 'Something went wrong!' });
            }
          });
        } else {
          res.status(401).send({ errorMsg: 'Invalid Old Password!' });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function deleteEmployee(req, res) {
  const missing = [];

  if (!req.body.deleteUserId) {
    missing.push('deleteUserId');
  }
  if (missing.length) {
    res.status(400).send({ Error: 'missing ' + missing.join(', ') });
    return;
  }

  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === 2 || existedUser.role === 1) {
          User.findOneAndRemove({
            _id: req.body.deleteUserId,
          }, (err1, result) => {
            if (err1) {
              res.status(400).send(err1);
            } else {
              if (result) {
                res.status(200).send(result);
              } else {
                res.status(400).send({ errorMsg: 'Something went wrong!' });
              }
            }
          });
        } else {
          const temp = 'Permission denied! Require Role 1 (Employee Admin) or 2 (Business Owner)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}


export function vipSignUp(req, res) {
  const saltsalt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('HelloWorld', saltsalt);
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === -2) {
          User.create({
            role: -1,
            approved: false,
            name: req.body.name,
            avatar: req.body.avatar,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            salt: saltsalt,
          }, (err1, newUser) => {
            if (err1) {
              res.status(400).send(err1);
            } else {
              console.log(newUser);
              res.status(200).send(newUser);
            }
          });
        } else {
          const temp = 'Permission denied! Require Role -2 (Venkman)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function employeeSignUp(req, res) {
  const saltsalt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('HelloWorld', saltsalt);
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === 1 || existedUser.role === 2) {
          User.create({
            role: 0,
            approved: false,
            name: req.body.name,
            avatar: req.body.avatar,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            salt: saltsalt,
            business: existedUser.business,
          }, (err1, newUser) => {
            if (err1) {
              res.status(400).send(err1);
            } else {
              res.status(200).send(newUser);
            }
          });
        } else {
          const temp = 'Permission denied! Require Role 1 (Employee Admin) or 2 (Business Owner)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function changeRole(req, res) {
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === 2) {
          User.findOneAndUpdate({
            _id: req.body.userId,
          }, {
            role: parseInt(req.body.role, 10),
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
          const temp = 'Permission denied! Require 2 (Business Owner)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}

export function editEmployee(req, res) {
  User.findOne({ _id: req.user._id }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (existedUser) {
        if (existedUser.role === 2 || existedUser.role === 1) {
          const setObj = {};
          if (req.body.name) {
            setObj.name = req.body.name;
          }
          if (req.body.avatar) {
            setObj.avatar = req.body.avatar;
          }
          if (req.body.phone) {
            setObj.phone = req.body.phone;
          }
          if (req.body.email) {
            setObj.email = req.body.email;
          }
          if (req.body.receiveSMS || req.body.receiveEmail || req.body.theme) {
            setObj.settings = {};
            if (req.body.receiveSMS) {
              setObj.settings.receiveSMS = req.body.receiveSMS;
            }
            if (req.body.receiveEmail) {
              setObj.settings.receiveEmail = req.body.receiveEmail;
            }
            if (req.body.receiveBrowserNotification) {
              setObj.settings.receiveBrowserNotification = req.body.receiveBrowserNotification;
            }
            if (req.body.theme) {
              setObj.settings.theme = req.body.theme;
            }
          }

          User.findOneAndUpdate({
            _id: req.body.userId,
          }, {
            $set: setObj,
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
          const temp = 'Permission denied! Require Role 1 (Employee Admin) or 2 (Business Owner)';
          res.status(400).send({ errorMsg: temp });
        }
      } else {
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}
