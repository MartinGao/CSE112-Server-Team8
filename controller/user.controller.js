import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import * as BusinessController from './business.controller';
const User = mongoose.model('User');


const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';


export function currentUser(req, res) {
  User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) }).exec((err, existedUser) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if(existedUser){
        res.status(200).send(existedUser);
      }
      else{
        res.status(400).send({ errorMsg: 'Invalid Token (userId)' });
      }
    }
  });
}


export function signUp(req, res) {
  if (req.body.role === '1') {
    // _createAdminUser(req, res);
  } else if (req.body.role === '2') {
    _createManagerUser(req, res);
  } else if (req.body.role === '3') {
    _createEmployeeUser(req, res);
  } else {
    res.status(400).send({ errorMsg: 'Missing "rold" field' });
  }
}

export function signIn(req, res) {
  console.log('user signIn!');
  console.log(req.body);
  User.findOne({
    email: req.body.email
  }, (err, existedUser) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      // Email Exists
      if (existedUser) {
        if (bcrypt.compareSync(req.body.password, existedUser.password)) {
          res.status(200).send({
            token: jwt.sign({
              _id: existedUser._id
            }, JWT_SECRET),
            user: existedUser
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

function _createManagerUser(req, res) {
  console.log(req.body);

  if (!req.body.name) {
    res.status(400).send({ errorMsg: 'Missing "name" field' });
  }
  if (!req.body.password) {
    res.status(400).send({ errorMsg: 'Missing "password" field' });
  }
  if (!req.body.phone) {
    res.status(400).send({ errorMsg: 'Missing "phone" field' });
  }
  if (!req.body.email) {
    res.status(400).send({ errorMsg: 'Missing "email" field' });
  }

  var user = new User();
  req.user = user;
  BusinessController.createBusiness(req, (err, newBusiness) => {
    if (err) {
      res.status(400).send(newBusiness);
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
          business: user.business,
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
        res.status(403).send({ errorMsg: 'Unauthorized User!' });
      }
    }
  });
}
