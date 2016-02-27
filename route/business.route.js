/**
 * Created by besin on 2/26/2016.
 */
import * as business from '../controller/business.controller';

module.exports = function(app) {
  app.route('/business/new').post(business.newBusiness);
};