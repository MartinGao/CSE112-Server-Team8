import * as queue from '../controller/queue.controller';

module.exports = function(app) {
  app.route('/queue/create').post(queue.create);
};
