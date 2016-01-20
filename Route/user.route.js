'use strict';

import * as user from '../controller/user.controller';

module.exports = function(app) {

	app.route('/user/create')
		.get(user.create)

};
