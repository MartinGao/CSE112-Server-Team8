import * as form from '../controller/form.controller';

module.exports = function(app) {
	app.route('/form/').post(form.createForm);
};