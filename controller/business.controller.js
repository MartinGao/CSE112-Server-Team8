/**
* Created by besin on 2/26/2016.
*/
import mongoose from 'mongoose';
const Business = mongoose.model('Business');

export function createBusiness(req, callback) {
  const missing = [];

  if (!req.body.businessName) {
    missing.push('missing name');
  }
  
  if (missing.length) {
    callback(true, { Error: missing.join(', ') });
    return;
  }

  Business.findOne({ name: req.body.name }).exec((err, business) => {
    if (err) {
      callback(true, { Error: err });
      return;
    }


    if (business) {
      console.log('Duplicated "name" field.');
      callback(true, { Error: 'Duplicated "name" field.' });
      return;
    }


    Business.create({
      name: req.body.businessName,
      logo: req.body.logo,
      description: req.body.description,
    }, (err1, newBusiness) => {
      if (err1) {
        callback(true, { Error: err1 });
        return;
      }
      callback(false, newBusiness);
    });
  });
}

// export function _search(req, res, next) {
// }
