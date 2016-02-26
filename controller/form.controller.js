/**
 * Controller for Forms
 *
 */

import mongoose from 'mongoose';
var form = mongoose.model('Form');

export function createForm(req, res, next) {
	var missing = [];
	console.log(req);
	if(!req.body.businessId){
		missing.push("businessID is required.");
	}
	if(missing.length){
		return res.status(400).send({
			"Error: " missing.join(', ');
		});
	}

	var newForm = new form();
	newForm.description = req.body.description || null;
	newForm.save(function (err, updatedForm) {
		if(err){
			return res.status(400).send(err);
		}
		else{
			return res.status(200).send(updatedForm);
		}
	});
}