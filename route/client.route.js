import * as client from '../controller/client.controller';

module.exports = function(app) {
  app.route('/client/employees').get(client.employees);
};
