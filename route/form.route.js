import * as form from '../controller/form.controller';

/**
 * @api {post} /form Create new form
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiParam {ObjectId} businessId The ID of the business to update
 * @apiParam {String} description The description of the business
 * @apiParam {String} businessType The type of business (health care, fitness, etc.)
 * @apiParam {Object} form The dynamic form associated with the business
 *
 * @apiSuccess {Object} form Returns the new form that was created
 * @apiSuccessExample Example JSON on success:
 * {
     description: 'Cool form',
		 businessType: 'fitness',
     form: {
       formId: 12345,
  	   businessId: 678,
       field: { String: 'something' },
       timestamp: date
     }
 * }
 *
 * @apiError MissingBody Missing businessID or form
 */

 /**
 * @api {delete} /form Delete form
 * @apiName DeleteForm
 * @apiGroup Form
 *
 * @apiParam {String} id The form id of the form to delete
 *
 * @apiSuccess {Object} end Deletes the form
 *
 * @apiError Error
 */
module.exports = (app) => {
  app.route('/form/').post(form.createForm);
  app.route('/form/formId').delete(form.deleteForm);
};
