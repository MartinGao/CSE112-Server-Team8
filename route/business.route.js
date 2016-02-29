/**
 * Created by besin on 2/26/2016.
 */
import * as business from '../controller/business.controller';

/**
 * @api {post} /business Create new business
 * @apiName CreateBusiness
 * @apiGroup Business
 *
 * @apiParam {Object} req Information stored in body: name, url, logo, description, owner
 *
 * @apiSuccess {Object} business Returns the new business that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   name:'Cool Hospital',
 *   url:'coolhospital.org',  	
 *   owner:'Dr. Cool'
 * }
 *
 * @apiError MissingBody Missing name, url, or owner
 */
module.exports = function(app) {
  app.route('/business/new').post(business.newBusiness);
};