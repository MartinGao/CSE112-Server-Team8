import * as visitor from '../controller/visitor.controller';

module.exports = function(app) {
  app.route('/visitor/new').post(visitor.newVisitor);
};
