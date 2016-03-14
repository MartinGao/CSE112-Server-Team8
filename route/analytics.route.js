import * as analytics from '../controller/analytics.controller';

/**
 * @api {post} /analytics Create new analytics page
 * @apiName CreateAnalytics
 * @apiGroup Analytics
 *
 * @apiParam {String} planLevel The current plan level (basic, popular, premier)
 * @apiParam {Number} totalClients The total number of clients (businesses)
 * @apiParam {Number} avgNumEmployees The average number of employees per business
 * @apiParam {Number} numMonthlySignups The number of monthly signups
 * @apiParam {Number} totalIncome The total monthly income per plan level
 * @apiParam {Number} numCLientsBasic The number of clients on the basic plan level
 * @apiParam {Number} numClientsPopular The number of clients on the popular plan level
 * @apiParam {Number} numClientsPremier The number of clients on the premier plan level
 *
 * @apiDescription Will return analytics. If any fields are missing, will return an error
 * @apiExample HTTP Sample
 * POST /form HTTP/1.1
 Host: localhost:3000
 Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ1MTVhZWUyZGRmOWQ5MGNmNjNlMDgiLCJpYXQiOjE0NTc0MDk1NjF9.oLoxhuGRSn4Wy0miaMpBTMMvo8LFdoHV5TAnyNiIBoo
 Cache-Control: no-cache
 Postman-Token: a1311038-9468-8df8-13cd-dff24041f385
 Content-Type: application/x-www-form-urlencoded


 *
 * @apiSuccess {Object} updatedAnalytics Returns the new analytics page that was created
 * @apiSuccessExample Example JSON on success:
 * {
  "analytics": {
    "__v": 0,
    "totalIncome": 51000,
    "numClientsPremier": 200,
    "numClientsPopular": 300,
    "numClientsBasic": 500,
    "numMonthlySignups": 250,
    "avgNumEmployees": 200,
    "totalClients": 1000,
    "planLevel": "basic",
    "_id": "56e60b8460c5486085452456",
    "timeStamp": {
      "updated": "2016-03-14T00:53:24.859Z",
      "created": "2016-03-14T00:53:24.859Z"
    }
  }
}
 *
 * @apiError MissingBody Missing analytics
 */

import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = (app) => {
  app.route('/analytics').post(expressJwt({ secret: JWT_SECRET }), analytics.createAnalytics);
  // app.route('/analytics').delete(expressJwt({ secret: JWT_SECRET }), analytics.deleteAnalytics);
};
