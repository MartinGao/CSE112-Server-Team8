import * as user from '../controller/user.controller';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

/**
* @api {post} /user/signUp Create new Manager and Business
* @apiName CreateNewManagerUserAndBusiness
* @apiGroup User
*
* @apiParam {String} role Please pass 2.
* @apiParam {String} name Manager's name.
* @apiParam {String} email  Manager's email. Use this email to sign in.
* @apiParam {String} password  Manager's password. Use this password to sign in.
* @apiParam {String} businessName Name of the Business that this manager owns.
* @apiParam {String} [avatar]  Whatever Id that points to manager's avatar.
* @apiParam {String} [logo]  Whatever Id that points to business logo.
* @apiParam {String} [description] Description for manager's business.
*
* @apiSuccessExample Example JSON on success:
{
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ0ZTMzYjQ2NGJiYjM2MTQxZTFjY2IiLCJpYXQiOjE0NTY3OTI0NDJ9.ky4p_0gBDKJNIr_F9TPoKe-ULiO2v6xooLrMCJvOJ8w",
"user": {
"_id": "56d4e33b464bbb36141e1ccb",
"name": "Martin Gao",
"email": "marting.gao11@gmail.com",
"password": "$2a$10$YvdPtnBR6uW/7uY3vUwDhuHUFURZw9jk8bU6B9j6dHoQtQ2swfd52",
"salt": "$2a$10$YvdPtnBR6uW/7uY3vUwDhu",
"business": "56d4e33b464bbb36141e1cca",
"token": "$2a$31$KHIIEJ/7wowN2fuTwsDfn.",
"tokenExpiredAt": "2017-03-01T00:32:59.675Z",
"__v": 0,
"timeStamp": {
"updated": "2016-03-01T00:32:59.676Z",
"created": "2016-03-01T00:32:59.675Z"
},
"avatar": null,
"approved": true,
"role": 2
}
}
*
* @apiError UserCreateError User create error
*/

/**
* @api {post} /user/signIn Signin User
* @apiName SignInUser
* @apiGroup User
*
* @apiParam {String} email  Email.
* @apiParam {String} password Password.

* @apiSuccessExample Example JSON on success:
{
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ0ZTMzYjQ2NGJiYjM2MTQxZTFjY2IiLCJpYXQiOjE0NTY3OTIzNzl9.-4li-ZP39HzFyVLsNkMVgtiwNMCSZXlXNGc6nd0Y5gI",
"user": {
"__v": 0,
"name": "Martin Gao",
"email": "marting.gao11@gmail.com",
"password": "$2a$10$YvdPtnBR6uW/7uY3vUwDhuHUFURZw9jk8bU6B9j6dHoQtQ2swfd52",
"salt": "$2a$10$YvdPtnBR6uW/7uY3vUwDhu",
"business": "56d4e33b464bbb36141e1cca",
"token": "$2a$31$KHIIEJ/7wowN2fuTwsDfn.",
"tokenExpiredAt": "2017-03-01T00:32:59.675Z",
"_id": "56d4e33b464bbb36141e1ccb",
"timeStamp": {
"updated": "2016-03-01T00:32:59.676Z",
"created": "2016-03-01T00:32:59.675Z"
},
"approved": true,
"role": 2
}
}
*
* @apiError InvalidInfo Invalid password or email
*/


/**
* @api {post} /user [INCOMPLETE]Create new employee user
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

	app.route('/user/signIn').post(user.signIn);

	app.route('/user').get(expressJwt({ secret: JWT_SECRET }), user.currentUser);
};
