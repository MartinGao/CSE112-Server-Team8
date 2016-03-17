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
var token, business;

const email = 'test' + chance.email();
const name = 'test' + chance.name();
const password = chance.string({length: 8});
const businessName = name + ' Test Company';

describe.skip('Notification', function () {
    const uriBus = uri + 'business/';
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

            Business.findOneAndRemove({name: businessName}, function () {
                User.findOneAndRemove({email: email}, function () {
                    console.log(chalk.blue('AFTER: Cleared test User/Business'));
                    done();
                });
            });
        });
    });

    describe("GET", function () {

        it('Correct', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                business = JSON.parse(body);
                assert.notEqual(business, undefined);
                done();
            });
        });
    });

    describe("List", function () {

        it('Correct', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus + 'list'
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                business = JSON.parse(body);
                assert.notEqual(business, undefined);
                done();
            });
        });
    });


    describe("PUT", function () {

        it('Correct', function (done) {
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                business = JSON.parse(body);
                assert.notEqual(business, undefined);
                done();
            });
        });
    });

    describe("Suspend", function () {

        it('Correct', function (done) {
            request.delete({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                business = JSON.parse(body);
                assert.notEqual(business, undefined);
                done();
            });
        });
    });

});