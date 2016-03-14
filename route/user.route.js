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
* @apiParam {String} phone Manager's phone number.
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
* @apiError {400} MissingRole Missing "role" field
* @apiError {400} MissingName Missing "name" field
* @apiError {400} MissingPassword Missing "password" field
* @apiError {400} MissingPhone Missing "phone" field
* @apiError {400} MissingEmail Missing "email" field
*/

/**
* @api {post} /user/signIn Signin User
* @apiName SignInUser
* @apiGroup User
*
* @apiParam {String} email  Email.
* @apiParam {String} password Password.
*
* @apiExample HTTP Example
* POST /user/signIn HTTP/1.1
* Host: localhost:3000
* Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ1MTVhZWUyZGRmOWQ5MGNmNjNlMDgiLCJpYXQiOjE0NTc0MDk1NjF9.oLoxhuGRSn4Wy0miaMpBTMMvo8LFdoHV5TAnyNiIBoo
* Cache-Control: no-cache
* Postman-Token: b1e734d5-5673-3d25-d2e0-b9173fe17130
* Content-Type: application/x-www-form-urlencoded
*
* email=a%40a.com&password=a
*
* @apiSuccessExample Example JSON on success:
* {
*	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ0ZTMzYjQ2NGJiYjM2MTQxZTFjY2IiLCJpYXQiOjE0NTY3OTIzNzl9.-4li-ZP39HzFyVLsNkMVgtiwNMCSZXlXNGc6nd0Y5gI",
*	"user": {
*	"__v": 0,
*	"name": "Martin Gao",
*	"email": "marting.gao11@gmail.com",
*	"password": "$2a$10$YvdPtnBR6uW/7uY3vUwDhuHUFURZw9jk8bU6B9j6dHoQtQ2swfd52",
*	"salt": "$2a$10$YvdPtnBR6uW/7uY3vUwDhu",
*	"business": "56d4e33b464bbb36141e1cca",
*	"token": "$2a$31$KHIIEJ/7wowN2fuTwsDfn.",
*	"tokenExpiredAt": "2017-03-01T00:32:59.675Z",
*	"_id": "56d4e33b464bbb36141e1ccb",
*	"timeStamp": {
*	"updated": "2016-03-01T00:32:59.676Z",
*	"created": "2016-03-01T00:32:59.675Z"
*	},
*	"approved": true,
*	"role": 2
*	}
* }
*
* @apiError InvalidEmail No user found with that email
* @apiError InvalidPassword User found, but password does not match
*/

/**
* @api {get} /user Return User by token
* @apiName ReturnUser
* @apiGroup User
*
* @apiHeader {String} JWT token required (required)

* @apiSuccess {Object} user Returns the new employee user that was created
* @apiSuccessExample Example JSON on success:
*	{
*	  "_id": "56d4e57bd3877b5615155b6b",
*	  "name": "Martin Gao",
*	  "email": "marting.gao@gmail.com",
*	  "password": "$2a$10$ov56uucwGoi5tivr81djyu2wxXORbvHqLH3d1Q.u0n0szkMluenMy",
*	  "salt": "$2a$10$ov56uucwGoi5tivr81djyu",
*	  "business": "56d4e57ad3877b5615155b6a",
*	  "token": "$2a$31$wTh1wYnF0VvhoIEOFnn76.",
*	  "tokenExpiredAt": "2017-03-01T00:42:35.089Z",
*	  "__v": 0,
*	  "timeStamp": {
*		"updated": "2016-03-01T00:42:35.094Z",
*		"created": "2016-03-01T00:42:35.091Z"
*	  },
*	  "avatar": null,
*	  "approved": true,
*	  "role": 2
*	}
*
**/



/**
* @api {put} /user/password Change Password
* @apiName ChangePassword
* @apiGroup User
*
* @apiHeader {String} JWT token required (required)
* @apiParam {String} oldPassword  Required.
* @apiParam {String} newPassword Required.
*
*
* @apiSuccess {Object} user Returns the new employee user that was created
* @apiSuccessExample Example JSON on success:
{
"__v": 0,
"name": "yuangong",
"email": "1232",
"phone": "123",
"password": "$2a$10$48G6VCudpiuTfRBrZlgr2OhyfKlwQeZX.RtgEgdiUO7ZcTtrU6n.G",
"salt": "$2a$10$48G6VCudpiuTfRBrZlgr2O",
"business": "56de80fe4998461bd4ebb62e",
"_id": "56de8241725a0a8ed441d99a",
"timeStamp": {
"updated": "2016-03-08T07:41:53.434Z",
"created": "2016-03-08T07:41:53.434Z"
},
"approved": true,
"role": 3
}
*
* @apiError UserCreateError User create error
*/

/**
* @api {delete} /user Delete an user
* @apiName DeleteUser
* @apiGroup User
*
* @apiHeader {String} JWT token required (required)
* @apiParam {String} deleteUserId  Required. Only Manager can delete user.
*
*
* @apiSuccess {Object} user Returns the new employee user that was created
* @apiSuccessExample Example JSON on success:
{
"__v": 0,
"name": "yuangong",
"email": "1232",
"phone": "123",
"password": "$2a$10$48G6VCudpiuTfRBrZlgr2OhyfKlwQeZX.RtgEgdiUO7ZcTtrU6n.G",
"salt": "$2a$10$48G6VCudpiuTfRBrZlgr2O",
"business": "56de80fe4998461bd4ebb62e",
"_id": "56de8241725a0a8ed441d99a",
"timeStamp": {
"updated": "2016-03-08T07:41:53.434Z",
"created": "2016-03-08T07:41:53.434Z"
},
"approved": true,
"role": 3
}
*
* @apiError UserCreateError User create error
*/

/**
* @api {put} /user Update user info
* @apiName UpdateUser
* @apiGroup User
*
* @apiHeader {String} JWT token required (required)
* @apiParam {String} [name] Don't pass this param if no change
* @apiParam {String} [avatar]  Don't pass this param if no change
* @apiParam {String} [phone] Don't pass this param if no change
* @apiParam {String} [email]  Don't pass this param if no change
* @apiParam {String} [receiveSMS]  Don't pass this param if no change
* @apiParam {String} [receiveEmail]  Don't pass this param if no change
* @apiParam {String} [theme]  Don't pass this param if no change
* @apiSuccess {Object} user Returns the new employee user that was created
* @apiSuccessExample Example JSON on success:
{
"__v": 0,
"name": "yuangong",
"email": "1232",
"phone": "123",
"password": "$2a$10$48G6VCudpiuTfRBrZlgr2OhyfKlwQeZX.RtgEgdiUO7ZcTtrU6n.G",
"salt": "$2a$10$48G6VCudpiuTfRBrZlgr2O",
"business": "56de80fe4998461bd4ebb62e",
"_id": "56de8241725a0a8ed441d99a",
"timeStamp": {
"updated": "2016-03-08T07:41:53.434Z",
"created": "2016-03-08T07:41:53.434Z"
},
"approved": true,
"role": 3
}
*
* @apiError UserCreateError User create error
*/


// Apidoc For VIP
/**
* @api {post} /vip/signUp/ Create new Venkman Support
* @apiGroup VIP
*
* @apiParam {String} name Account's name.
* @apiParam {String} phone Account's phone number.
* @apiParam {String} email  Account's email. Use this email to sign in.
* @apiParam {String} [password] DO NOT PASS IT. Default password 'HelloWorld'
* @apiParam {String} [avatar]  Whatever Id that points to Account's avatar.
*/

// Apidoc For Employee
/**
* @api {post} /employee/signUp Create new Employee
* @apiGroup Employee
*
* @apiHeader {String} JWT token required (required)
*
* @apiParam {String} name  Account's name.
* @apiParam {String} phone Account's phone number.
* @apiParam {String} email Account's email. Use this email to sign in.
* @apiParam {String} [avatar]  Whatever Id that points to Account's avatar.
* @apiParam {String} [password] DO NOT PASS IT. Default password 'HelloWorld'
* @apiParam {String} [role] DO NOT PASS IT. Only accept 2 (Business Owner) and 1 (Employee Admin)
*/

/**
* @api {put} /employee/edit Edit Employee
* @apiGroup Employee
*
* @apiHeader {String} JWT token required (required)
*
* @apiParam {String} name  Account's name.
* @apiParam {String} phone Account's phone number.
* @apiParam {String} email Account's email. Use this email to sign in.
* @apiParam {String} [avatar]  Whatever Id that points to Account's avatar.
* @apiParam {String} [password] DO NOT PASS IT. Default password 'HelloWorld'
* @apiParam {String} [role] DO NOT PASS IT. Only accept 2 (Business Owner) and 1 (Employee Admin)
*/

/**
* @api {put} /employee/changeRole Change Employee Role
* @apiGroup Employee
*
* @apiHeader {String} JWT token required (required)
*
* @apiParam {String} userId  Employee's UserId.
* @apiParam {Number} role New role. Either 1 (promote) or 0 (demote)
* @apiParam {String} [role] DO NOT PASS IT. Only accept 2 (Business Owner)
*/

/**
* @api {get} /employee/list List all Employee
* @apiGroup Employee
*
* @apiHeader {String} JWT token required (required)
* @apiParam {String} [role] DO NOT PASS IT. Only accept 2 (Business Owner) and 1 (Employee Admin)
*/

module.exports = (app) => {
  app.route('/vip/signUp')
  .post(expressJwt({ secret: JWT_SECRET }), user.vipSignUp)

  app.route('/user/signUp')
  .post(user.ownerSignUp);

  app.route('/user/signIn')
  .post(user.signIn);

  app.route('/user')
  .get(expressJwt({ secret: JWT_SECRET }), user.currentUser)
  .put(expressJwt({ secret: JWT_SECRET }), user.updateUser)
  .delete(expressJwt({ secret: JWT_SECRET }), user.deleteEmployee);

  app.route('/user/password')
  .put(expressJwt({ secret: JWT_SECRET }), user.changePassword);

  app.route('/employee/signUp')
  .post(expressJwt({ secret: JWT_SECRET }), user.employeeSignUp);

  app.route('/employee/list')
  .get(expressJwt({ secret: JWT_SECRET }), user.listEmployees);

  app.route('/employee/edit')
  .put(expressJwt({ secret: JWT_SECRET }), user.editEmployee);

  app.route('/employee/changeRole')
  .put(expressJwt({ secret: JWT_SECRET }), user.changeRole);
};
