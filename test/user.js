/**
 * Created by besin on 3/15/2016.
 */

var assert = require('assert');
var request = require('request');

const uri = 'http://localhost:3000';

describe('User', function () {

    var server;
    before(function () {
        server = require('../index');
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