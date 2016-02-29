import * as user from '../controller/user.controller';

/**
 * @api {get} /user Sign in user
 * @apiName SignInUser
 * @apiGroup User
 *
 * @apiParam {Object} req Information stored in query: email, password
 *
 * @apiSuccess {Object} user Returns the user found
 * @apiSuccessExample Example JSON on success:
 * {
 *   userId: 12345,
 *   businessId: 678,
 *   name: 'Paige Shint',
 *   email: 'paiger1998@gmail.com',
 *   password: 'encryptedthing32423424'
 * }
 *
 * @apiError InvalidInfo Invalid password or email
 */

/**
 * @api {post} /user Create new admin user
 * @apiName CreateAdminUser
 * @apiGroup User
 *
 * @apiParam {Object} req Information stored in body: firstName, lastName, avatar, email, password, department, position
 *
 * @apiSuccess {Object} user Returns the new admin user that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   role: 1,
 *   firstName: 'Admin',
 *   lastName: 'User',
 *   avatar: 'coolpicurl.com',
 *   email: 'adminuser@coolhospital.org',
 *   password: 'wouldyoulikefrieswiththatsalt',
 * }
 *
 * @apiError UserCreateError User create error
 */

/**
 * @api {post} /user Create new employee user
 * @apiName CreateEmployeeUser
 * @apiGroup User
 *
 * @apiParam {Object} req Information stored in body: firstName, lastName, avatar, email, password, department, position
 *
 * @apiSuccess {Object} user Returns the new employee user that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   role: 3,
 *   firstName: 'Employee',
 *   lastName: 'User',
 *   avatar: 'coolpicurl2.com',
 *   email: 'employed@coolhospital.org',
 *   password: 'nobutiwouldlikesomehash',
 * }
 *
 * @apiError UserCreateError User create error
 */
module.exports = function (app) {
	app.route('/user/signUp').post(user.signUp);
	app.route('/user/signIn').get(user.signIn);
};
