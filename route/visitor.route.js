import * as visitor from '../controller/visitor.controller';

/**
 * @api {post} /visitor Create new visitor
 * @apiName CreateVisitor
 * @apiGroup Visitor
 *
 * @apiParam {Object} req Information stored in body: name
 *
 * @apiSuccess {Object} visitor Returns the new visitor that was created
 * @apiSuccessExample Example JSON on success:
 * {
 *   visitorId: 1337,
 *   businessId: 1,
 *   name: 'Vissy Torr',
 *   phone: 8675309,
 *   email: 'hiimsick1954@gmail.org',
 *   form: {
 *     formId: 12345,
 *	   businessId: 1,
 *     field: { String: 'something' },
 *     timestamp: date
 *   }	
 * }
 *
 * @apiError MissingName Missing name
 */
module.exports = function(app) {
  app.route('/visitor').post(visitor.newVisitor);
};

/**
 * @api {put} /visitor Check off visitor
 * @apiName CheckOffVisitor
 * @apiGroup Visitor
 *
 * @apiParam {Object} req Information stored in params: visitorId
 *
 * @apiSuccess {Object} visitor Checks off the visitor
 * @apiSuccessExample Example JSON on success:
 * {
 *   visitorId: 1337,
 *   businessId: 1,
 *   name: 'Vissy Torr',
 *   phone: 8675309,
 *   email: 'hiimsick1954@gmail.org',
 *   form: {
 *     formId: 12345,
 *	   businessId: 1,
 *     field: { String: 'something' },
 *     timestamp: date
 *   }	
 * }
 *
 * @apiError IncorrectBusinessId Incorrect businessId
 */
module.exports = function(app) {
    app.route('/visitor/:visitorId').put(visitor.checkOffVisitor);
}

/**
 * @api {delete} /visitor Delete visitor
 * @apiName DeleteVisitor
 * @apiGroup Visitor
 *
 * @apiParam {Object} req Information stored in params: visitorId
 *
 * @apiSuccess {Object} visitor Deletes the visitor
 * @apiSuccessExample Example JSON on success:
 * {
 *   visitorId: 1337,
 *   businessId: 1,
 *   name: 'Vissy Torr',
 *   phone: 8675309,
 *   email: 'hiimsick1954@gmail.org',
 *   form: {
 *     formId: 12345,
 *	   businessId: 1,
 *     field: { String: 'something' },
 *     timestamp: date
 *   }	
 * }
 *
 * @apiError IncorrectBusinessId Incorrect businessId
 */
module.exports = function(app) {
    app.route('/visitor/:visitorId').delete(visitor.deleteVisitor);
}

/**
 * @api {get} /visitor Get queue
 * @apiName GetQueue
 * @apiGroup Visitor
 *
 * @apiParam {Object} req Information stored in params: page, per_page
 *
 * @apiSuccess {Object} queue Returns queue
 * @apiSuccessExample Example JSON on success:
 * {
 *   name:'Cool Queue',
 *   email:'cool@coolhospital.org',
 *   reason:'Patient queue',  	
 *   user:'Cool Employee'
 * }
 *
 * @apiError MissingPage Missing page or page is 0, missing per_page or per_page is 0
 */
module.exports = function(app) {
    app.route('/visitor/queue').get(visitor.getQueue);
}

module.exports = function(app) {
  app.route('/visitor/visited').get(visitor.deleteVisitor);
}