import * as visitor from '../controller/visitor.controller';

import expressJwt from 'express-jwt';

const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = (app) => {
  app.route('/visitor/new').post(expressJwt({ secret: JWT_SECRET }), visitor.createVisitor);
  app.route('/visitor/:visitorId')
    .put(expressJwt({ secret: JWT_SECRET }), visitor.checkOffVisitor)
    .delete(expressJwt({ secret: JWT_SECRET }), visitor.deleteVisitor);
  app.route('/visitor/queue').get(expressJwt({ secret: JWT_SECRET }), visitor.getQueue);
  app.route('/visitor/visited').get(expressJwt({ secret: JWT_SECRET }), visitor.getVisitors);
  app.route('/searchVisitor').get(expressJwt({ secret: JWT_SECRET }), visitor.searchVisitor);
  app.route('/searchUser').get(expressJwt({ secret: JWT_SECRET }), visitor.searchUser);


  app.route('/visitor/testPusher').get(visitor.testPusher);
};

/**
 * @api {post} /visitor/new Create new visitor
 * @apiName CreateVisitor
 * @apiGroup Visitor
 *
 * @apiDescription the parameters passed in BODY
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {String} name visitors name (required)
 * @apiParam {String} email visitor's email
 * @apiParam {String} phone visitor's phone
 * @apiParam {Object} form form data associated with visitor
 * @apiParam {String} requiredCheckOff pass in a 0 if you want the Visitor to be immediately checked off
 *
 * @apiExample HTTP Post Example
 * POST /visitor/new HTTP/1.1
 * Host: localhost:3000
 * Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ1MTVhZWUyZGRmOWQ5MGNmNjNlMDgiLCJpYXQiOjE0NTc0MDk1NjF9.oLoxhuGRSn4Wy0miaMpBTMMvo8LFdoHV5TAnyNiIBoo
 * Cache-Control: no-cache
 * Postman-Token: 51d4ef25-a4cd-5713-464a-f625cc6e9d60
 * Content-Type: application/x-www-form-urlencoded
 *
 * name=Billy
 *
 * @apiSuccess {Object} visitor Returns the new visitor that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *  "__v": 0,
 *  "businessId": "56d4f62dfabca20273777587",
 *  "name": "Stasdfasan Khmelnitski",
 *  "_id": "56d5120003c99bc0730f3721",
 *  "timeStamp": {
 *    "updated": "2016-03-01T03:52:32.281Z",
 *    "created": "2016-03-01T03:52:32.273Z"
 * },
 *  "form": {
 * )   "stuff": "things"
 *  },
 *  "checkOff": null,
 *  "checkIn": "2016-03-01T03:52:32.273Z",
 *  "phone": null,
 *  "email": "abc123@gmail.com"
 * }
 *
 * @apiErrorExample
 * {
 *  "Error": "missing name"
 * }
 */

/**
 * @api {put} /visitor/:visitorId Check off visitor
 * @apiName CheckOffVisitor
 * @apiGroup Visitor
 *
 * @apiDescription the parameters are passed in the URL (replace ':visitorId' with the id of the visitor)
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {String} id of visitor you want to check off (required)
 *
 * @apiSuccessExample Example JSON on success:
 * {
 *  "__v": 0,
 *  "businessId": "56d4f62dfabca20273777587",
 *  "name": "Stasdfasan Khmelnitski",
 *  "_id": "56d5120003c99bc0730f3721",
 *  "timeStamp": {
 *    "updated": "2016-03-01T03:52:32.281Z",
 *    "created": "2016-03-01T03:52:32.273Z"
 * },
 *  "form": {
 * )   "stuff": "things"
 *  },
 *  "checkOff": null,
 *  "checkIn": "2016-03-01T03:52:32.273Z",
 *  "phone": null,
 *  "email": "abc123@gmail.com"
 * }
 *
 * @apiErrorExample {json} Error-Response:
 * {
 * "message": "Cast to ObjectId failed for value \"123\" at path \"_id\"",
 *  "name": "CastError",
 *  "kind": "ObjectId",
 *  "value": "123",
 *  "path": "_id"
 * }
 */

/**
 * @api {get} /visitor/queue Get queue
 * @apiName GetQueue
 * @apiGroup Visitor
 *
 * @apiDescription returns the current visitors that have not been checked off sorted by time, parameters passed in the query string
 * @apiExample HTTP GET Request Sample
 * localhost:3000/visitor/queue?page=1&per_page=5
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {String} page what page you want (1 is first page) (required)
 * @apiParam {String} per_page (required)
 *
 * @apiSuccess {Array} queue returns an array of Visitor Objects
 * @apiSuccessExample Example JSON on success:
 * [
 *  {
 *   "_id": "56d51fc707e032f073613212",
 *   "businessId": "56d4f62dfabca20273777587",
 *   "name": "Stasdfasan Khmelnitski",
 *   "__v": 0,
 *   "timeStamp": {
 *     "updated": "2016-03-01T04:51:19.541Z",
 *     "created": "2016-03-01T04:51:19.530Z"
 *   },
 *   "form": {
 *     "stuff": "things"
 *   },
 *   "checkOff": null,
 *   "checkIn": "2016-03-01T04:51:19.530Z",
 *   "phone": null,
 *   "email": "abc123@gmail.com"
 * },
 * {
 *   "_id": "56d5120003c99bc0730f3721",
 *   "businessId": "56d4f62dfabca20273777587",
 *   "name": "Stasdfasan Khmelnitski",
 *   "__v": 0,
 *   "timeStamp": {
 *     "updated": "2016-03-01T03:52:32.281Z",
 *     "created": "2016-03-01T03:52:32.273Z"
 *   },
 *   "form": {
 *     "stuff": "things"
 *   },
 *   "checkOff": null,
 *   "checkIn": "2016-03-01T03:52:32.273Z",
 *   "phone": null,
 *   "email": "abc123@gmail.com"
 * },
 * {
 *   "_id": "56d505692ffae45273c1dc54",
 *   "businessId": "56d4f62dfabca20273777587",
 *   "name": "Stan Khmelnitski",
 *   "__v": 0,
 *   "timeStamp": {
 *     "updated": "2016-03-01T02:58:49.478Z",
 *     "created": "2016-03-01T02:58:49.470Z"
 *   },
 *   "form": {
 *     "stuff": "things"
 *   },
 *   "checkOff": null,
 *   "checkIn": "2016-03-01T02:58:49.470Z",
 *   "phone": null,
 *   "email": "abc123@gmail.com"
 *  }
 * ]
 *
 * @apiError MissingPage Missing page or page is 0, missing per_page or per_page is 0
 * @apiErrorExample {json} Error-Response:
 * {
 *  "Error": "missing per_page or per_page is 0"
 * }
 * @apiError {401} Unauthenticated
 * @apiError {404} UserNotFound
 */

 /**
 * @api {get} /visitor/visited Get checked off visitors on a certain date
 * @apiName GetQueue
 * @apiGroup Visitor
 *
 * @apiDescription returns the visitors that have been checked off sorted by time, parameters passed in the query string
 * @apiExample HTTP Get Example
 * localhost:3000/visitor/visited?page=1&per_page=5&date=02-29-2016
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {String} page what page you want (1 is first page) (required)
 * @apiParam {String} per_page how many things visitors per page(required)
 * @apiParam {String} date must be in the form MM-DD-YYYY
 *
 * @apiSuccess {Array} queue returns an array of Visitor Objects
 * @apiSuccessExample Example JSON on success:
 * [
 *  {
 *   "_id": "56d51fc707e032f073613212",
 *   "businessId": "56d4f62dfabca20273777587",
 *   "name": "Stasdfasan Khmelnitski",
 *   "__v": 0,
 *   "timeStamp": {
 *     "updated": "2016-03-01T04:51:19.541Z",
 *     "created": "2016-03-01T04:51:19.530Z"
 *   },
 *   "form": {
 *     "stuff": "things"
 *   },
 *   "checkOff": 2016-03-01T03:52:32.273Z,
 *   "checkIn": "2016-03-01T04:51:19.530Z",
 *   "phone": null,
 *   "email": "abc123@gmail.com"
 * },
 * {
 *   "_id": "56d5120003c99bc0730f3721",
 *   "businessId": "56d4f62dfabca20273777587",
 *   "name": "Stasdfasan Khmelnitski",
 *   "__v": 0,
 *   "timeStamp": {
 *     "updated": "2016-03-01T03:52:32.281Z",
 *     "created": "2016-03-01T03:52:32.273Z"
 *   },
 *   "form": {
 *     "stuff": "things"
 *   },
 *   "checkOff": 2016-03-01T03:52:32.273Z,
 *   "checkIn": "2016-03-01T03:52:32.273Z",
 *   "phone": null,
 *   "email": "abc123@gmail.com"
 * },
 * {
 *   "_id": "56d505692ffae45273c1dc54",
 *   "businessId": "56d4f62dfabca20273777587",
 *   "name": "Stan Khmelnitski",
 *   "__v": 0,
 *   "timeStamp": {
 *     "updated": "2016-03-01T02:58:49.478Z",
 *     "created": "2016-03-01T02:58:49.470Z"
 *   },
 *   "form": {
 *     "stuff": "things"
 *   },
 *   "checkOff": 2016-03-01T03:52:32.273Z,
 *   "checkIn": "2016-03-01T02:58:49.470Z",
 *   "phone": null,
 *   "email": "abc123@gmail.com"
 *  }
 * ]
 *
 * @apiError MissingPage Missing page or page is 0, missing per_page or per_page is 0
 * @apiErrorExample {json} Error-Response:
 * {
 *  "Error": "missing per_page or per_page is 0"
 * }
 */

/**
 * @api {get} /searchVisitor Search for Visitors
 * @apiName Search
 * @apiGroup Visitor
 *
 * @apiDescription returns the visitors that have been checked off sorted by time, parameters passed in the query string
 * @apiExample Example Query
 * localhost:3000/searchVisitor?term=jo
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {String} term the RegEx expression to use for search (required)
 *
 * @apiSuccess {Array} visitors returns an array of Visitor Objects
 * @apiSuccessExample Example JSON on success:
 * [
 {
   "_id": "56e9e8abe170dd14e7ee4885",
   "businessId": "56e9e4975b97ba20dc944ed4",
   "name": "Joe",
   "__v": 0,
   "timeStamp": {
     "updated": "2016-03-16T23:13:47.018Z",
     "created": "2016-03-16T23:13:47.018Z"
   },
   "form": null,
   "checkOff": null,
   "checkIn": "2016-03-16T23:13:47.018Z",
   "phone": null,
   "email": "joe@joe.com"
 }
 ]
 *
 * @apiError {401} Unauthenticated User not signed in
 */
/**
 * @api {get} /searchUser Search Users
 * @apiName Search
 * @apiGroup User
 *
 * @apiDescription returns the visitors that have been checked off sorted by time, parameters passed in the query string
 * @apiExample Example Query
 * localhost:3000/searchUser?term=b
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {String} term the RegEx expression to use for search (required)
 *
 * @apiSuccess {Array} users returns an array of User Objects
 * @apiSuccessExample Example JSON on success:
 * [
 {
   "_id": "56e9e4975b97ba20dc944ed3",
   "phone": "1",
   "salt": "$2a$10$8YiSaBX4BgW5HevOqyazz.",
   "password": "$2a$10$8YiSaBX4BgW5HevOqyazz.TCaZ5nLPPrgWxAls0ga.0myLs0nhu.G",
   "email": "b@b.b",
   "name": "Billy",
   "__v": 0,
   "settings": {
     "theme": null,
     "receiveBrowserNotification": null,
     "receiveEmail": null,
     "receiveSMS": null
   },
   "timeStamp": {
     "updated": "2016-03-16T22:56:23.898Z",
     "created": "2016-03-16T22:56:23.898Z"
   },
   "business": "56e9e4975b97ba20dc944ed4",
   "avatar": null,
   "approved": true,
   "role": 2
 }
 ]
 *
 * @apiError {401} Unauthenticated User not signed in
 */