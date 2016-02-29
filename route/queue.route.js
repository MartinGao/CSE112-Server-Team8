import * as queue from '../controller/queue.controller';

/**
 * @api {post} /queue Create new queue
 * @apiName CreateQueue
 * @apiGroup Queue
 *
 * @apiParam {Object} req Information stored in body: name, email, reason, user, avatar
 *
 * @apiSuccess {Object} Returns the new queue that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   name:'Cool Queue',
 *   email:'cool@coolhospital.org',
 *   reason:'Patient queue',  	
 *   user:'Cool Employee'
 * }
 *
 * @apiError 400 Error
 */
module.exports = function(app) {
  app.route('/queue/create').post(queue.create);
};
