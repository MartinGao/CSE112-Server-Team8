import * as form from '../controller/form.controller';

/**
 * @api {post} /form Create new form
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiParam {ObjectId} businessId The ID of the business to update. This business will be linked to the form.
 * @apiParam {String} description The description of the business
 * @apiParam {String} businessType The type of business (health care, fitness, etc.)
 * @apiParam {Object} form The dynamic form associated with the business
 *
 * @apiDescription Will return business and form. If business is null, failed to update business
 * @apiExample HTTP Sample
 * POST /form HTTP/1.1
 Host: localhost:3000
 Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmQ1MTVhZWUyZGRmOWQ5MGNmNjNlMDgiLCJpYXQiOjE0NTc0MDk1NjF9.oLoxhuGRSn4Wy0miaMpBTMMvo8LFdoHV5TAnyNiIBoo
 Cache-Control: no-cache
 Postman-Token: a1311038-9468-8df8-13cd-dff24041f385
 Content-Type: application/x-www-form-urlencoded

 businessId=56d4e57ad3877b5615155b6a&description=A+real+nice+form&businessType=Unemployed&form=%7B%7D
 *
 * @apiSuccess {Object} FormAndBusiness Returns the new form and business that was created
 * @apiSuccessExample Example JSON on success:
 * {
  "form": {
    "__v": 0,
    "form": "blahblah",
    "description": "stuff",
    "_id": "56df7c564a28dd40e32e27be",
    "timeStamp": {
      "updated": "2016-03-09T01:28:54.026Z",
      "created": "2016-03-09T01:28:54.026Z"
    }
  },
  "business": {
    "_id": "56df49e1f5cc731e5d9e1f1c",
    "name": "Business",
    "__v": 0,
    "formId": "56df7c564a28dd40e32e27be",
    "timeStamp": {
      "updated": "2016-03-09T01:28:31.844Z",
      "created": "2016-03-08T21:53:37.268Z"
    },
    "slackHook": null,
    "userIds": [],
    "backgroundImageUrl": null,
    "iconURL": null,
    "phone": "1111111111",
    "url": null,
    "planLevel": "Enterprise",
    "userId": null
  }
}
 *
 * @apiError MissingBody Missing businessID or form
 */

 /**
 * @api {delete} /form Delete form
 * @apiName DeleteForm
 * @apiGroup Form
 *
 * @apiParam {String} id The form id of the form to delete
 *
 * @apiSuccess {Object} end Deletes the form
 *
 * @apiError Error Form not found, or something went wrong
 */

import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = (app) => {
  app.route('/form').post(expressJwt({ secret: JWT_SECRET }), form.createForm);
  app.route('/form').delete(expressJwt({ secret: JWT_SECRET }), form.deleteForm);
};
