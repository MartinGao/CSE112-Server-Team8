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
 * @apiParam {String} businessType The type of business (fitness, health, other)
 * @apiParam {String} url The url of the business
 * @apiParam {String} phone The phone number
 * @apiParam {String} iconURL The URL to the icon
 * @apiParam {String} backgroundImageURL The URL to the background image
 * @apiParam {[ObjectId]} userIds The array of IDs
 * @apiParam {String} form The information contained in the form
 * @apiParam {String} slackHook The URL of the webhook used to integrate slack notifications
 *
 * @apiSuccess {Object} business Returns the updated business
 * @apiSuccessExample Example JSON on success:
 * {
  "_id": "56ea20512b102a392bb8532f",
  "name": "Saul Goodman",
  "__v": 0,
  "form": "[{\"id\":\"name\",\"component\":\"textInput\",\"editable\":false,\"index\":0,.........",
  "timeStamp": {
    "updated": "2016-03-17T03:11:13.712Z",
    "created": "2016-03-17T03:11:13.712Z"
  },
  "slackHook": null,
  "suspended": false,
  "userIds": [],
  "backgroundImageUrl": null,
  "iconURL": null,
  "phone": "551020102",
  "url": null,
  "businessType": "health",
  "numEmployees": 10000,
  "planLevel": "basic",
  "userId": null
}
 *
 * @apiError Missing businessId, body, userId, email, name
 */
/**
 * @api {get} /business Get a business (and form)
 * @apiExample Example
 * /business?businessId=56ea20512b102a392bb8532f
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
  "_id": "56ea20512b102a392bb8532f",
  "name": "Saul Goodman",
  "__v": 0,
  "form": "[{\"id\":\"name\",\"component\":\"textInput\",\"editable\":false,..........."
    "updated": "2016-03-17T03:11:13.712Z",
    "created": "2016-03-17T03:11:13.712Z"
  },
  "slackHook": null,
  "suspended": false,
  "userIds": [],
  "backgroundImageUrl": null,
  "iconURL": null,
  "phone": "551020102",
  "url": null,
  "businessType": "fitness",
  "numEmployees": 10000,
  "planLevel": "basic",
  "userId": null
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
