/**
 * Created by besin on 3/15/2016.
 *
 * Sample for Mocha tests
 * Documentation found at: http://mochajs.org/
 *
 * Want to run it? Run the following in terminal:
 *      mocha
 */

var assert = require('assert');
describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});