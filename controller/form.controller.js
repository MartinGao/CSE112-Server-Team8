/**
 * Controller for Forms
 *
 */

import mongoose from 'mongoose';
var form = mongoose.model('Form');

/**
 * @api {post} /form Create form
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiSuccess {Object} updatedForm Form with information.
 *
 * @apiSuccessExample 
 * {
 *  " body": 'temp'
 * } 
 */

export function createForm(req, res, next) {
	var missing = [];

	if(!req.body.businessId)
		missing.push("businessID is required.");
	if(!req.body.form)
		missing.push("form is required");
	if(missing.length){
		return res.status(400).send({
			"Error: " missing.join(', ');
		});
	}

	var newForm = new form();
	newForm.description = req.body.description || null;
	newForm.form = req.body.form;
	newForm.save(function (err, updatedForm) {
		if(err){
			return res.status(400).send(err);
		}
		else{
			return res.status(200).send(updatedForm);
		}
	});
}

export function deleteForm(req, res, next) {
	
}
