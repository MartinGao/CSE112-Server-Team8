import * as analytics from '../controller/analytics.controller';

import expressJwt from 'express-jwt';
const JWT_SECRET = '#rub_a_dubDub_thanks_forthe_grub!';

module.exports = (app) => {
  app.route('/analytics').post(expressJwt({ secret: JWT_SECRET }), analytics.createAnalytics);
  // app.route('/analytics').delete(expressJwt({ secret: JWT_SECRET }), analytics.deleteAnalytics);
};
