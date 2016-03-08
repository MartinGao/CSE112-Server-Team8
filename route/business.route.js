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
 * @api {get} /business Get a business
 * @apiExample /business?businessId=56d4e57ad3877b5615155b6a
 * @apiName GetBusiness
 * @apiGroup Business
 *
 * @apiDescription Specify businessId in the Query
 *
 * @apiParam {ObjectId} businessId The ID of the business to fetch
 *
 * @apiSuccess {Object} business Returns the business if found
 * @apiSuccessExample Example JSON on success:
 * {
  "_id": "56d4e57ad3877b5615155b6a",
  "name": "Martin's No.1 Company",
  "owner": null,
  "__v": 0,
  "timeStamp": {
    "updated": "2016-03-01T00:42:34.689Z",
    "created": "2016-03-01T00:42:34.689Z"
  },
  "slackHook": null,
  "userIds": [],
  "backgroundImageUrl": null,
  "iconURL": null,
  "phone": null,
  "url": null,
  "planLevel": "basic",
  "userId": null
}
 *
 * @apiError {400} MissingBusinessId
 * @apiError {400} Error
 * @apiError {401} UserUnauthenticated
 * @apiError {404} NotFound
 */
import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = function(app) {
  app.route('/business').put(expressJwt({ secret: JWT_SECRET }), business.setBusiness);
  //app.route('/business/new').post(business.newBusiness);
  app.route('/business').get(expressJwt({ secret: JWT_SECRET }), business.getBusiness);
};
