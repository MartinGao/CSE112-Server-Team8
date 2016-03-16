/**
 * Created by besin on 3/16/2016.
 */
import chalk from 'chalk';
import assert from 'assert';
import request from 'request';
import mongoose from 'mongoose';
import Chance from 'Chance';

let chance = new Chance();
const uri = 'http://localhost:3000/visitor';
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
        this.slow(10000);
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
    });
});