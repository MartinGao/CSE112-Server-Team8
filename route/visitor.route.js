import * as visitor from '../controller/visitor.controller';

module.exports = function(app) {
  app.route('/visitor').post(visitor.newVisitor);
};

module.exports = function(app) {
    app.route('/visitor/:visitorId').put(visitor.checkOffVisitor);
}

module.exports = function(app) {
    app.route('/visitor/:visitorId').delete(visitor.deleteVisitor);
}

module.exports = function(app) {
    app.route('/visitor/queue').get(visitor.getQueue);
}

module.exports = function(app) {
  app.route('/visitor/visited').get(visitor.deleteVisitor);
}