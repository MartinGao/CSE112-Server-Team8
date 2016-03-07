import * as form from '../controller/form.controller';

/**
 * @api {post} /form Create new form
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiParam {Object} req Information stored in body: businessId, form, description
 *
 * @apiSuccess {Object} form Returns the new form that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   description: 'Cool form',
 *   form: {
 *     formId: 12345,
 *	   businessId: 678,
 *     field: { String: 'something' },
 *     timestamp: date
 *   }	
 * }
 *
 * @apiError MissingBody Missing businessID or form
 */

/**
 * @api {delete} /form/formId Delete form
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiParam {Object} id ID of form to delete set in the query.
 *
 * @apiError Error Missing formId
 */

module.exports = function(app) {
	app.route('/form/').post(form.createForm);
	app.route('/form/formId').delete(form.deleteForm);
};