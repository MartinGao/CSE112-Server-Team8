/**
 * Controller for Forms
 *
 */

import mongoose from 'mongoose';
const Form = mongoose.model('Form');
const Business = mongoose.model('Business');

export function createForm(req, res) {
  const missing = [];

  if (!req.body.businessId) {
    missing.push('businessID is required.');
  }
  if (!req.body.form) {
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
              return res.status(200).send({form: updatedForm, business: updatedBusiness});
            });
          }
          else
            return res.status(200).send({form: updatedForm, business: null});
        });
      }
    else
      return res.status(400).send({Error: 'Failed to save form.'});
  });
}

export function deleteForm(req, res) {
  if (!req.body.form) {
    return res.status(400).send({ Error: 'no form' });
  }

  Form.findById(req.body.businessId, (err, formToDelete) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (formToDelete) {
      formToDelete.findOneAndRemove({
        businessId: formToDelete.businessId }).exec((err1) => {
          if (err1) {
            return res.status(400).send(err1);
          }
          return res.status(200).send({ Success: 'form was deleted' });
        });
    }
  });
}
