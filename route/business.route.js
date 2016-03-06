/**
 * Created by besin on 2/26/2016.
 */
import * as business from '../controller/business.controller';

/**
 * @api {post} /business Update business
 * @apiName UpdateBusiness
 * @apiGroup Business
 *
 * @apiParam {ObjectId} businessId The ID of the business to update
 * @apiParam {ObjectId} userId The ID of the user who is the owner
 * @apiParam {String} name The name of the business
 * @apiParam {String} url The url of the business
 * @apiParam {String} phone The phone number
 * @apiParam {String} iconURL The URL to the icon
 * @apiParam {String backgroundImageURL The URL to the background image
 * @apiParam {[ObjectId]} userIds The array of IDs
 * @apiParam {ObjectId} formId The ID of the form
 * @apiParam {String} slackHook The URL of the webhook used to integrate slack notifications
 *
 * @apiSuccess {Object} business Returns the new business that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   businessId: ...,
 *   userId: ...,
 *   name:'Cool Hospital',
 *   url:'coolhospital.org',
 *   phone:'6194928002',
 *   iconURL:'/images/coolHospital.png',
 *   backgroundImageURL:'/bkg/coolHospital.jpg',
 *   userIds: [],
 *   formId: ...
 * }
 *
 * @apiError Missing businessId, body, userId, email, name
 */
/**
 * @api {get} /business Get a business
 * @apiName GetBusiness
 * @apiGroup Business
 *
 * @apiParam {ObjectId} businessId The ID of the business to fetch
 *
 * @apiSuccess {Object} business Returns the business if found
 * @apiSuccessExample Example JSON on success:
 * {
 *   businessId: ...,
 *   userId: ...,
 *   name:'Cool Hospital',
 *   url:'coolhospital.org',
 *   phone:'6194928002',
 *   iconURL:'/images/coolHospital.png',
 *   backgroundImageURL:'/bkg/coolHospital.jpg',
 *   userIds: [],
 *   formId: ...
 * }
 *
 * @apiError Missing businessId
 */
module.exports = function(app) {
  app.route('/business').post(business.setBusiness);
  //app.route('/business/new').post(business.newBusiness);
  app.route('/business').get(business.getBusiness);
};
