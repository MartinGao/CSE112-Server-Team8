import mongoose from 'mongoose';
const Client = mongoose.model('Client');
const User = mongoose.model('User');


export function create(req, _res) {

}

export function createOne(req, callback) {
  Client.create({
    name: req.body.clientName,
    logo: '',
    description: '',
    owner: null,
  }, (err, newClient) => {
    callback(err, newClient);
  });
}

export function employees(req, res) {
  User.findOne({ token: req.query.token }).exec((err, user) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (user) {
        User.find({ client: mongoose.Types.ObjectId(user.client) }).exec((err2, employeesArray) => {
          if (err) {
            res.status(400).send(err2);
          } else {
            res.status(200).send(employeesArray);
          }
        });
      } else {
        res.status(403).send({ errorMsg: 'Unauthorized User!' });
      }
    }
  });
}
