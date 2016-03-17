import * as analytics from '../controller/analytics.controller';

/**
 * @api {get} /analytics/user Get analytics for user
 * @apiName GetUserAnalytics
 * @apiGroup Analytics
 *
 * @apiParam {Date} date_from The date to get data from. Format: MM-DD-YYYY
 * @apiParam {Date} date_to The date to get data to. Format: MM-DD-YYYY
 *
 * @apiDescription Will return user analytics during the period date_from to date_to. 
 * @apiExample HTTP Sample
 * GET /analytics/user?date_from=03-10-2016&amp;date_to=03-17-2016 HTTP/1.1
 * Host: 52.86.89.63:3000
 * Cache-Control: no-cache
 * Postman-Token: a3270a93-b74b-ee65-1776-aec83545408b
 *
 * @apiSuccess {Object} retAnalytics Returns the user analytics data within the date range specified.
 * @apiSuccessExample Example JSON on success:
 *{
    "count": 105,
    "basic": {
      "count": 104,
      "timeStamps": {
        "03-17-2016": {
          "count": 94
        },
        "03-16-2016": {
          "count": 10
        }
      }
    },
    "premier": {
      "count": 1,
      "timeStamps": {
        "03-16-2016": {
          "count": 1
        }
      }
    },
    "free": {
      "count": 0,
      "timeStamps": {}
    }
 *}
 *
 * @apiError MissingDateFrom Missing date_from
 * @apiError MissingDateTo Missing date_to
 */

/**
 * @api {get} /analytics/visitor Get analytics for visitor
 * @apiName GetVisitorAnalytics
 * @apiGroup Analytics
 *
 * @apiHeader {String} JWT token required (required)
 * @apiParam {Date} date_from The date to get data from. Format: MM-DD-YYYY
 * @apiParam {Date} date_to The date to get data to. Format: MM-DD-YYYY
 *
 * @apiDescription Will return visitor analytics during the period date_from to date_to. 
 * @apiExample HTTP Sample
 * GET /analytics/visitor?date_from=03-10-2016&date_to=03-17-2016 HTTP/1.1
 * Host: 52.86.89.63:3000
 * Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmU5ZDYwZTUwMjQ1ZDkxMzYxMzAyYTYiLCJpYXQiOjE0NTgyNDUzMzh9.0ElnH7wlJbbaojwd1F9OIUWp00HsOSkLz9X896c8muE
 * Cache-Control: no-cache
 * Postman-Token: 3c9dbfae-75a4-d73c-d488-09e2e1d09879
 *
 * @apiSuccess {Object} retAnalytics Returns the visitor analytics data within the date range specified.
 * @apiSuccessExample Example JSON on success:
 *{
    "count": 2,
    "visitors": {
      "count": 0,
      "timeStamps": {
        "03-17-2016": {
          "count": 2
        }
      }
    }
 *}
 *
 * @apiError MissingDateFrom Missing date_from
 * @apiError MissingDateTo Missing date_to
 */

import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = (app) => {
  app.route('/analytics/user').get(analytics.getUserAnalytics);
  app.route('/analytics/visitor')
    .get(expressJwt({ secret: JWT_SECRET }), analytics.getVisitorAnalytics);
};
