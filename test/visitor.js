/**
 * Created by besin on 3/16/2016.
 */
import chalk from 'chalk';
import assert from 'assert';
import request from 'request';
import mongoose from 'mongoose';
import Chance from 'Chance';

let chance = new Chance();
const uri = 'http://localhost:3000/';
var token, visitor;

const email = 'test' + chance.email();
const name = 'test' + chance.name();
const visitorName = 'test' + chance.name();
const visitorEmail = 'test' + chance.email();
const password = chance.string({length: 8});
const businessName = name + ' Test Company';

describe('Visitor', function () {
    this.slow(10000);
    var server;
    before(function (done) {
        // set up server
        server = require('../index');
        // delete possibly existing user and business
        mongoose.connect('mongodb://admin:Qgj4zFWLnig2YW@ds019038.mlab.com:19038/cse112', (err) => {
            assert(err, null, 'Could not connect to MongoDB!');
            const User = mongoose.model('User');
            const Business = mongoose.model('Business');
            Business.findOneAndRemove({name: businessName}, function () {
                User.findOneAndRemove({email: email}, function () {
                    console.log(chalk.blue('BEFORE: Cleared test User/Business'));

                    // create test user
                    request.post({
                        headers: {'content-type': 'application/x-www-form-urlencoded'},
                        url: uri + 'user/signUp',
                        body: 'role=2&name=' + name + '&phone=1112223333&email='
                        + email + '&password=' + password + '&businessName='
                        + businessName
                    }, function (err, res, body) {
                        assert.equal(err, null);
                        assert.equal(res.statusCode, 200);
                        var result = JSON.parse(body);
                        token = result.token;
                        assert.notEqual(result, null, 'User is null.');
                        done();
                    });

                });
            });
        });

    });
    after(function (done) {
        // delete new user and business
        mongoose.connect('mongodb://admin:Qgj4zFWLnig2YW@ds019038.mlab.com:19038/cse112', (err) => {
            assert(err, null, 'Could not connect to MongoDB!');
            const User = mongoose.model('User');
            const Business = mongoose.model('Business');
            const Visitor = mongoose.model('Visitor');

            Visitor.findOneAndRemove({name: visitorName}, function () {
                Business.findOneAndRemove({name: businessName}, function () {
                    User.findOneAndRemove({email: email}, function () {
                        console.log(chalk.blue('AFTER: Cleared test Visitor/User/Business'));
                        done();
                    });
                });
            });
        });
    });

    describe('NEW', function () {
        const uriNew = uri + 'visitor/new';
        it('GET', function (done) {
            request(uriNew, function (err, res, body) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('POST with no parameters', function (done) {
            request.post({url: uriNew}, function (err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('POST with no name', function (done) {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriNew
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.Error, undefined, 'body.Error is undefined');
                done();
            });
        });
        it('POST correct', function (done) {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriNew,
                body: 'name=' + visitorName + '&email=' + visitorEmail
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                visitor = JSON.parse(body);
                assert.notEqual(visitor, undefined, 'body.Error is undefined');
                assert.equal(visitor.email, visitorEmail, "Email not the same.");
                assert.equal(visitor.name, visitorName, "Name is not the same.");
                done();
            });
        });
    });

    describe('Queue', function () {
        const uriQueue = uri + 'visitor/queue';
        it('No parameters or JWT', function (done) {
            request({
                url: uriQueue
            }, function (err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });

        it('No parameters', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriQueue
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                done();
            });
        });

        it('Correct', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriQueue + '?page=1&per_page=5'
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                var queue = JSON.parse(body);
                assert.equal(queue.length, 1, 'Queue is not length 1.');
                done();
            });
        });
    });

    describe('PUT (checkoff)', function () {
        const uriCheckoff = uri + 'visitor/';
        it('PUT with no parameters', function (done) {
            request.put({
                url: uriCheckoff
            }, function (err, res, body) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('PUT with no visitorID', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriCheckoff
            }, function (err, res, body) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('PUT correct', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriCheckoff + visitor._id
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                var result = JSON.parse(body);
                assert.equal(result._id, visitor._id, "Returned visitor does not match ID.");
                done();
            });
        });
    });

    describe('Search', function () {
        const uriSearch = uri + 'search';
        it('No JWT', function (done) {
            request({
                url: uriSearch + '?term=*'
            }, function (err, res) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('No term', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriSearch
            }, function (err, res) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('Correct', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriSearch + '?term=*'// + visitor.name
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                var result = JSON.parse(body);
                assert.notEqual(result.visitors, undefined, "Visitors not defined.");
                assert.equal(result.visitors[0]._id, visitor._id, "Returned visitor does not match ID.");

                done();
            });
        });
    });
});