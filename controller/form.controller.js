/**
 * Controller for Forms
 *
 */

import mongoose from 'mongoose';
import winston from 'winston';
import 'winston-loggly';
const Form = mongoose.model('Form');
const Business = mongoose.model('Business');
const logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Loggly)({
      level: 'debug',
      json: true,
      inputToken: '8b1c41e3-1818-4595-a284-8f3675678a98',
      subdomain: 'phoenixsol' 
    })
  ]
});

export function createForm(req, res) {
  const missing = [];

  if (!req.body.businessId) {
    logger.error('createForm Error: businessID is required');
    missing.push('businessID is required.');
  }
  if (!req.body.form) {
    logger.error('createForm Error: form is required');
    missing.push('form is required.');
  }
  if (missing.length) {
    return res.status(400).send({
      Error: missing.join(', '),
    });
  }

  const newForm = new Form();
  newForm.description = req.body.description || null;

  if (req.body.businessType === 'fitness' || 'health_care') {
    newForm.businessType = req.body.businessType;
  }

  newForm.form = req.body.form;
  newForm.save((err, updatedForm) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (updatedForm) {
        Business.findOne({ _id: req.body.businessId }).exec(function (err, business) {
          if (err || !business)
            return res.status(400).send({form: updatedForm, business: null});

          if (business) {
            business.formId = updatedForm._id;
            business.save(function (err1, updatedBusiness) {
              logger.info('Form successfully updated!');
              return res.status(200).send({form: updatedForm, business: updatedBusiness});
            });
          }
          else
            return res.status(200).send({form: updatedForm, business: null});
        });
      }
    else {
      logger.error('createForm Error: Failed to save form.');
      return res.status(400).send({Error: 'Failed to save form.'});
    }
  });
}

export function deleteForm(req, res) {
  const missing = [];

  if (!req.body.deleteFormId) {
    missing.push('deleteFormId');
  }
  if (missing.length) {
    return res.status(400).send({ Error: 'missing ' + missing.join(', ') });
  }

  Form.findOneAndRemove({ _id: req.body.deleteFormId }).exec((err1) => {
    if (err1) {
      logger.error('deleteForm Error: ' + err1);
      return res.status(400).send(err1);
    }
    logger.info('Form successfully deleted!');
    return res.status(200).send({ Success: 'form was deleted!' });
  });
}
