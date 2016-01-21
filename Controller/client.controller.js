import mongoose from 'mongoose';
const Client = mongoose.model('Client');


export function create(req, _res) {

}

export function createOne(req, callback) {
  Client.create({
    name: req.body.name,
    logo: req.body.logo,
    description: req.body.description,
    owner: null,
  }, (err, newClient) => {
    callback(err, newClient);
  });
}
