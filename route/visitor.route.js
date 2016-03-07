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
  app.route('/search').get(expressJwt({ secret: JWT_SECRET }), visitor.search);


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
 * @apiParam {String} phone visitor's phone (required)
 * @apiParam {Object} form form data assosiated with visitor
 * @apiParam {String} requiredCheckOff pass in a 0 if you want the Visitor to be immediatly checked off
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
 *  "Error": "missing name"
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
 * example query localhost:3000/visitor/queue?page=2&per_page=1
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
 */

 /**
 * @api {get} /visitor/visited Get checked off visitors on a certain date
 * @apiName GetQueue
 * @apiGroup Visitor
 *
 * @apiDescription returns the visitors that have been checked off sorted by time, parameters passed in the query string
 * example query localhost:3000/visitor/visited?page=1&per_page=5&date=02-29-2016
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
