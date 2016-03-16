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
var request = require('request');

const uri = 'http://localhost:3000';

describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

describe('Startup Server', function () {
    var server;
    before(function (done) {
        server = require('../index');
        setTimeout(done, 1000);
    });
    after(function () {
        //console.log(server);
        //server.close();
    });
    it('responds to /', function testSlash(done) {
        request(uri, function (err, res, body) {
            assert.equal(null, err);
            done();
        });
        //.get('/')
        //.expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request.get(uri + '/blah', function(err, res, body) {
            assert.notEqual(200, res.statusCode);
            done();
        });
        //request('http://localhost:3000')
        //    .get('/foo/bar')
        //    .expect(404, done);
    });
});