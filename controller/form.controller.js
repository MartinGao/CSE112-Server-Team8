/**
 * Controller for Forms
 *
 */

import mongoose from 'mongoose';
var form = mongoose.model('Form');

export function createForm(req, res, next) {
	var missing = [];

	if(!req.body.businessId)
		missing.push("businessID is required.");
	if(!req.body.form)
		missing.push("form is required");
	if(missing.length){
		return res.status(400).send({
			"Error": missing.join(', '),
		});
	}

	var newForm = new form();
	newForm.description = req.body.description || null;
	newForm.form = req.body.form;
	newForm.save(function (err, updatedForm) {
		if(err){
			return res.status(400).send(err);
		}
		if(updatedForm)
			return res.status(200).send(updatedForm);
	});
}

export function deleteForm(req, res, next) {
	var formId = req.query.id;

	form.findById(formId, function (err, formToDelete) {
		if(err)
			return res.status(400).send(err);
		if(formToDelete)
			formToDelete.remove(function (err) {
				if(err)
					return res.status(400).send(err);
				return res.status(200).end();
			});
	});
}
