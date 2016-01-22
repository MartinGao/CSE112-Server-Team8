import * as user from '../controller/user.controller';

module.exports = function (app) {
	app.route('/user/signUp').post(user.signUp);
	app.route('/user/signIn').get(user.signIn);
};
