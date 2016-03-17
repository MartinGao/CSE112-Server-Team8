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
var token, business, tokenVenkman;

const email = 'test' + chance.email();
const name = 'test' + chance.name();
const password = chance.string({length: 8});
const businessName = name + ' Test Company';

describe('Business', function () {
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


                        request.post({
                            headers: {'content-type': 'application/x-www-form-urlencoded'},
                            url: uri + 'user/signIn',
                            body: 'email=venkman@gmail.com&password=venkman'
                        }, function (err, res, body) {
                            assert.equal(res.statusCode, 200);
                            var json = JSON.parse(body);
                            tokenVenkman = json.token;
                            done();
                        });
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
                var bodyJSON = JSON.parse(body);
                assert.notEqual(bodyJSON, undefined);
                business = bodyJSON;
                done();
            });
        });
    });

    describe("List", function () {

        it('Not Venkman or Support', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus + 'list'
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                var result = JSON.parse(body);
                assert.notEqual(result.errorMsg, undefined);
                done();
            });
        });

        it('Current', function (done) {
            request({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + tokenVenkman
                },
                url: uriBus + 'list'
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });


    describe("PUT", function () {

        it('Correct', function (done) {
            assert.notEqual(business, undefined, 'Business not acquired from GET test.');
            request.put({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus,
                body: 'iconURL=http://google.com'
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                var newBusiness = JSON.parse(body);
                assert.notEqual(business.iconURL, newBusiness.iconURL);
                done();
            });
        });
    });

    describe("Suspend", function () {

        it('Not Venkman or Support', function (done) {
            request.del({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriBus
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                done();
            });
        });

        it('Correct', function (done) {
            assert.notEqual(business, undefined, 'Business not acquired from GET test.');
            request.del({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + tokenVenkman
                },
                url: uriBus,
                body: 'businessId=' + business._id + '&suspended=true'
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });

})
;