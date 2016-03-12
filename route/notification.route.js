import * as notification from '../controller/notification.controller';
import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';


/**
 * @api {post} /notification/sms Send a SMS
 * @apiGroup Notification
 *
 * @apiParam {String} to Destination Phone Number (e.g. 8589001234)
 * @apiParam {String} payload SMS Content
 */

 /**
  * @api {post} /notification/email Send an email
  * @apiGroup Notification
  *
  * @apiParam {String} to Destination Email Address
  * @apiParam {String} subject Email Subject
  * @apiParam {String} payload Email Content
  */

module.exports = (app) => {
  app.route('/notification/sms')
  .post(expressJwt({ secret: JWT_SECRET }), notification.sms);

  app.route('/notification/email')
  .post(expressJwt({ secret: JWT_SECRET }), notification.email);
};
