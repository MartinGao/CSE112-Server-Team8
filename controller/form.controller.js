/**
 * Controller for Forms
 *
 */

import mongoose from 'mongoose';
const Form = mongoose.model('Form');

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
  newForm.form = req.body.form;
  newForm.save((err, updatedForm) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (updatedForm) {
      return res.status(200).send(updatedForm);
    }
  });
}

export function deleteForm(req, res) {
  const formId = req.query.id;

  Form.findById(formId, (err, formToDelete) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (formToDelete) {
      formToDelete.remove((err1) => {
        if (err1) {
          return res.status(400).send(err1);
        }
        return res.status(200).end();
      });
    }
  });
}
