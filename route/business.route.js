/**
 * Created by besin on 2/26/2016.
 */
import * as business from '../controller/business.controller';

/**
 * @api {put} /business Update business
 * @apiName UpdateBusiness
 * @apiGroup Business
 *
 * @apiDescription Fields not defined in body will not be updated
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {ObjectId} businessId The ID of the business to update (required)
 * @apiParam {ObjectId} userId The ID of the user who is the owner
 * @apiParam {String} name The name of the business
 * @apiParam {String} planLevel The plan level of the business
 * @apiParam {String} url The url of the business
 * @apiParam {String} phone The phone number
 * @apiParam {String} iconURL The URL to the icon
 * @apiParam {String} backgroundImageURL The URL to the background image
 * @apiParam {[ObjectId]} userIds The array of IDs
 * @apiParam {ObjectId} formId The ID of the form
 * @apiParam {String} slackHook The URL of the webhook used to integrate slack notifications
 *
 * @apiSuccess {Object} business Returns the updated business
 * @apiSuccessExample Example JSON on success:
 * {
 * "_id": "56d4e57ad3877b5615155b6a",
 * "name": "Martin's No.1 Company",
 * "owner": null,
 * "__v": 0,
 * "timeStamp": {
 *   "updated": "2016-03-01T00:42:34.689Z",
 *   "created": "2016-03-01T00:42:34.689Z"
 * },
 * "slackHook": null,
 * "userIds": [],
 * "backgroundImageUrl": null,
 * "iconURL": null,
 * "phone": null,
 * "url": null,
 * "planLevel": "basic",
 * "userId": null
 *}
 *
 * @apiError Missing businessId, body, userId, email, name
 */
/**
 * @api {get} /business Get a business (and form)
 * @apiExample Example
 * /business?businessId=56d4e57ad3877b5615155b6a
 * @apiName GetBusiness
 * @apiGroup Business
 *
 * @apiDescription Specify businessId in the Query
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {ObjectId} businessId The ID of the business to fetch
 *
 * @apiSuccess {Object} BusinessAndForm Returns the business if found, form if found
 * @apiSuccessExample Example JSON on success:
 * {
  "business": {
    "_id": "56df49e1f5cc731e5d9e1f1c",
    "name": "Business",
    "__v": 0,
    "formId": "56df785f511b0f8519e245c8",
    "timeStamp": {
      "updated": "2016-03-09T01:12:28.177Z",
      "created": "2016-03-08T21:53:37.268Z"
    },
    "slackHook": null,
    "userIds": [],
    "backgroundImageUrl": null,
    "iconURL": null,
    "phone": "1111111111",
    "url": null,
    "planLevel": "basic",
    "userId": null
  },
  "form": {
    "_id": "56df785f511b0f8519e245c8",
    "form": "blahblah",
    "description": "stuff",
    "__v": 0,
    "timeStamp": {
      "updated": "2016-03-09T01:11:59.872Z",
      "created": "2016-03-09T01:11:59.872Z"
    },
    "businessType": "other"
  }
}
 *
 * @apiError {400} MissingBusinessId
 * @apiError {400} Error
 * @apiError {401} UserUnauthenticated
 * @apiError {404} NotFound
 */

 /**
 * @api {delete} /business (un)Suspend a Business
 * @apiGroup Business
 *
 * @apiHeader {String} JWT token required (required)
 *
 * @apiParam {String} businessId  Business's Id.
 * @apiParam {Boolean} suspended Either true (Suspend) or false (Unsuspend)
 * @apiParam {String} [role] DO NOT PASS IT. Only accept -2 (Venkman) or -1 (Venkman Support)
 */

 /**
 * @api {get} /business/list List all business
 * @apiGroup Business
 *
 * @apiHeader {String} JWT token required (required)
 *
 * @apiParam {String} [role] DO NOT PASS IT. Only accept -2 (Venkman) or -1 (Venkman Support)
 */
import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = (app) => {
  app.route('/business')
    .put(expressJwt({ secret: JWT_SECRET }), business.setBusiness)
    .delete(expressJwt({ secret: JWT_SECRET }), business.suspendBusiness)
    .get(expressJwt({ secret: JWT_SECRET }), business.getBusiness);

  app.route('/business/list')
    .get(expressJwt({ secret: JWT_SECRET }), business.listBusiness);

};
