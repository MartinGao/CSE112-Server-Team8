/**
 * Created by besin on 3/15/2016.
 */


import chalk from 'chalk';
import assert from 'assert';
import request from 'request';
import mongoose from 'mongoose';
import Chance from 'Chance';

let chance = new Chance();
const uri = 'http://localhost:3000/';
const uriSignIn = uri + 'user/signIn';
var user, token;

const email = 'test' + chance.email();
const name = 'test' + chance.name();
const password = chance.string({length: 8});
const newPassword = chance.string({length: 8});
const businessName = name + ' Test Company';

describe('User', function () {
    this.slow(10000);
    var server;
    before(function (done) {
        // set up server
        server = require('../index');
        this.slow(10000);
        // delete possibly existing user and business
        mongoose.connect('mongodb://admin:Qgj4zFWLnig2YW@ds019038.mlab.com:19038/cse112', (err) => {
            assert(err, null, 'Could not connect to MongoDB!');
            const User = mongoose.model('User');
            const Business = mongoose.model('Business');
            Business.findOneAndRemove({name: businessName}, function () {
                User.findOneAndRemove({email: email}, function () {
                    console.log(chalk.blue('BEFORE: Cleared test User/Business'));
                    done();
                });
            });
        });
    });
    after(function (done) {
        this.slow(10000);
        // delete new user and business
        mongoose.connect('mongodb://admin:Qgj4zFWLnig2YW@ds019038.mlab.com:19038/cse112', (err) => {
            assert(err, null, 'Could not connect to MongoDB!');
            const User = mongoose.model('User');
            const Business = mongoose.model('Business');
            Business.findOneAndRemove({name: businessName}, function () {
                User.findOneAndRemove({email: email}, function () {
                    console.log(chalk.blue('AFTER: Cleared test User/Business'));
                    done();
                });
            });
        });
    });

    describe('signUp', function () {
        const uriSignUp = uri + 'user/signUp';
        it('GET signUp', function (done) {
            request(uriSignUp, function (err, res, body) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('POST SignUp with no parameters', function (done) {
            request.post({url: uriSignUp}, function (err, res, body) {
                assert.notEqual(res, undefined, 'response is undefined');
                assert.notEqual(body, undefined, 'body is undefined');
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined, 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST SignUp with role = 1', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignUp,
                body: 'role=1'
            }, function (err, res, body) {
                assert.notEqual(res, undefined, 'response is undefined');
                assert.notEqual(body, undefined, 'body is undefined');
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined, 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST SignUp with role=1, name=Bob', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignUp,
                body: 'role=1&name=' + name
            }, function (err, res, body) {
                assert.notEqual(res, undefined, 'response is undefined');
                assert.notEqual(body, undefined, 'body is undefined');
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined, 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST SignUp with role=1, name=Bob, phone=1112223333', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignUp,
                body: 'role=1&name=' + name + '&phone=1112223333'
            }, function (err, res, body) {
                assert.notEqual(res, undefined, 'response is undefined');
                assert.notEqual(body, undefined, 'body is undefined');
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined, 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST SignUp with role=1, name=' + name + ', phone=1112223333, email=' + email, function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignUp,
                body: 'role=1&name=' + name + '&phone=1112223333&email=' + email
            }, function (err, res, body) {
                assert.notEqual(res, undefined, 'response is undefined');
                assert.notEqual(body, undefined, 'body is undefined');
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined, 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST SignUp with correct params', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignUp,
                body: 'role=1&name=' + name + '&phone=1112223333&email='
                + email + '&password=' + password + '&businessName='
                + businessName + '&form=test'
            }, function (err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                user = JSON.parse(body);
                assert.notEqual(user, null, 'User is null.');
                done();
            });
        });

    });

    describe('signIn', function () {
        it('GET', function (done) {
            request(uriSignIn, function (err, res, body) {
                assert.equal(res.statusCode, 404);
                done();
            });
        });
        it('POST with no parameters', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignIn
            }, function (err, res, body) {
                assert.notEqual(res, undefined, 'response is undefined');
                assert.notEqual(body, undefined, 'body is undefined');
                assert.equal(res.statusCode, 401);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined, 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST with invalid email', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignIn,
                body: 'email=NOTVALID'
            }, function (err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 401);
                var result = JSON.parse(body);
                assert.equal(result.errorMsg, 'Invalid Email!', 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST with invalid password', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignIn,
                body: 'email=' + email + '&password=NOTVALID'
            }, function (err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 401);
                var result = JSON.parse(body);
                assert.equal(result.errorMsg, 'Invalid Password!', 'body.errorMsg is undefined');
                done();
            });
        });
        it('POST valid email and password', function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriSignIn,
                body: 'email=' + email + '&password=' + password
            }, function (err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                var result = JSON.parse(body);
                assert.equal(result.errorMsg, undefined, 'body.errorMsg is undefined');
                assert.notEqual(result.token, undefined, 'token is undefined.');
                token = result.token;
                done();
            });
        });
    });

    describe('ChangePassword', function () {
        const uriPassword = uri + 'user/password';

        it('PUT no old/new password specified', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriPassword
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(res.body);
                assert.notEqual(result.Error, null);
                done();
            });
        });

        it('PUT no old password specified', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriPassword,
                body: 'newPassword=' + newPassword
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(res.body);
                assert.notEqual(result.Error, null);
                done();
            });
        });

        it('Correct', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriPassword,
                body: 'oldPassword=' + password + '&newPassword=' + newPassword
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                request.post({
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    url: uriSignIn,
                    body: 'email=' + email + '&password=' + newPassword
                }, function (err, res, body) {
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 200);
                    var result = JSON.parse(body);
                    assert.equal(result.errorMsg, undefined, 'body.errorMsg is undefined');
                    assert.notEqual(result.token, undefined, 'token is undefined.');
                    token = result.token;
                    done();
                });
            });
        });
    });

    describe('user', function () {
        const uriUser = uri + 'user';
        it('GET with no JWT', function (done) {
            request(uriUser, function (err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('GET with wrong JWT', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer WRONG' + token
                },
                url: uriUser
            }, function (err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('GET with correct JWT', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriUser
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                var result = JSON.parse(body);
                assert.notEqual(body, null, "Body is null");
                assert.equal(result.name, name, 'Returned different user name.');
                done();
            });
        });
        it('PUT with no JWT', function (done) {
            request.put({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: uriUser
            }, function (err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('PUT with wrong JWT', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer WRONG' + token
                },
                url: uriUser
            }, function (err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('PUT with correct JWT', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriUser
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                done();
            });
        });
        const newName = 'Georgina';
        it('PUT changing name', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                body: 'name=' + newName,
                url: uriUser
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                var result = JSON.parse(res.body);
                assert.notEqual(result, null, 'Body is null.');
                assert.equal(result.name, newName, 'Returned name was not changed.');
                done();
            });
        });

        it('DELETE with no JWT');
        it('DELETE with wrong role');
        it('DELETE with correct JWT');
    });

    describe('search', function () {
        it('search');
    })

});
