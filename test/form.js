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
var token, user, form;

const email = 'test' + chance.email();
const name = 'test' + chance.name();
const password = chance.string({length: 8});
const businessName = name + ' Test Company';

describe('Form', function () {
    const uriForm = uri + 'form/';
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
                        if (res.statusCode != 200)
                            console.log('status code: ' + res.statusCode + ', body: ' + body);
                        assert.equal(err, null);
                        assert.equal(res.statusCode, 200);
                        var result = JSON.parse(body);
                        token = result.token;
                        user = result.user;
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

    describe("Create", function () {

        it('No body', function (done) {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriForm
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                done();
            });
        });
        const formTemp = 'blahblah';

        it('Wrong businessId', function (done) {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriForm,
                body: 'businessId=WRONG&form=' + formTemp
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                business = JSON.parse(body);
                assert.notEqual(business, undefined);
                done();
            });
        });

        it('Correct', function (done) {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriForm,
                body: 'businessId=' + user.business + '&form=' + form
            }, function (err, res, body) {
                var bodyJSON = JSON.parse(body);
                console.log('body: ' + body);
                assert.equal(res.statusCode, 200);
                assert.notEqual(bodyJSON, undefined);
                assert.equal(bodyJSON.form.form, formTemp);
                form = bodyJSON.form;
                assert.equal(bodyJSON.business._id, user.business);
                done();
            });
        });
    });

    describe("Delete", function () {

        it('No deleteFormId', function (done) {
            request.del({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriForm
            }, function (err, res, body) {
                assert.equal(res.statusCode, 400);
                done();
            });
        });

        it('Correct', function (done) {
            assert.notEqual(form, undefined);
            request.del({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                },
                url: uriForm,
                body: 'deleteFormId=' + form._id
            }, function (err, res, body) {
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });

});