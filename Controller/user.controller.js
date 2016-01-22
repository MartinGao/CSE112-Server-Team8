import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment';
import * as ClientController from './client.controller';
const User = mongoose.model('User');

export function signUp(req, res) {
  if (req.body.role === '1') {
    _createAdminUser(req, res);
  }
  else if (req.body.role === '3') {
    _createEmployeeUser(req, res);
  }
}

export function signIn(req, res) {
  console.log('user signIn!');
  console.log(req.query);
  User.findOne({
    email: req.query.email,
  }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      // Email Exists
      if (user) {
        if (bcrypt.compareSync(req.query.password, user.password)) {
          res.status(200).send(user);
        } else {
          res.status(401).send({ errorMsg: 'Invaild Password!' });
        }
      } else {
        res.status(401).send({ errorMsg: 'Invaild Email!' });
      }
    }
  });
}

function _createAdminUser(req, res) {
  console.log(req.body);
  ClientController.createOne(req, (err, newClient) => {
    if (err) {
      console.log('client createOne error!');
      console.log(err);
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      User.create({
        role: 1,
        approved: true,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
        salt: salt,
        client: newClient._id,
        department: req.body.department,
        position: req.body.position,
        token: bcrypt.genSaltSync(32),
        tokenExpiredAt: moment().add(1, 'years'),
      }, (err1, newUser) => {
        if (err) {
          console.log('user create error!');
          console.log(err1);
        } else {
          console.log(newUser);
          res.send(newUser);
        }
      });
    }
  });
}

function _createEmployeeUser(req, res) {
  const saltsalt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, saltsalt);

  User.findOne({ token: req.body.token }).exec((err, user) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (user) {
        User.create({
          role: 3,
          approved: true,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          avatar: req.body.avatar,
          email: req.body.email,
          password: hash,
          salt: saltsalt,
          client: user.client,
          department: req.body.department,
          position: req.body.position,
          token: bcrypt.genSaltSync(32),
          tokenExpiredAt: moment().add(1, 'years'),
        }, (err1, newUser) => {
          if (err) {
            console.log('user create error!');
            console.log(err1);
          } else {
            console.log(newUser);
            res.send(newUser);
          }
        });
      } else {
        res.status(403).send({ errorMsg: 'Unauthoried User!' });
      }
    }
  });
}
