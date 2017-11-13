var request = require('request'), express = require('express'), assert = require("assert"),
var filename = 'x.png'
    , boundary = Math.random();

var fs = require('fs');
describe('http API tests', function () {

    it('Should Login as email and password are correct', function (done) {
        request.post(
            'http://localhost:8080/checkLogin',
            {form: {inputUsername: 'sunny19@yahoo.com', inputPassword: 'aajsunny'}},
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('Should not Login as email and password are incorrect', function (done) {
        request.post(
            'http://localhost:8080/checkLogin',
            {form: {inputUsername: 'sunny19@yahoo.com', inputPassword: 'aasunny'}},
            function (error, response, body) {
                assert.equal(400, response.statusCode);
                done();
            }
        );
    });

    it('Should register with user email and password', function (done) {
        request.post(
            'http://localhost:8080/registerUser',
            {form: {userEmail: 'aaj2@yahoo.com', password: 'aajsunny', firstName : 'sunny' , lastName : 'udhani' , work : 'sjsu', dob : '12/12/12'}},
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should not register with used user email', function (done) {
        request.post(
            'http://localhost:8080/registerUser',
            {form: {userEmail: 'aaj2@yahoo.com', password: 'aajsunny', firstName : 'sunny' , lastName : 'udhani' , work : 'sjsu', dob : '12/12/12'}},
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(400, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should ask for user files', function (done) {
        request.post(
            'http://localhost:8080/listFiles',
            {form: {filespath : 'sunny19@yahoo.com/'}},
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should not allow ask for user files', function (done) {
        request.post(
            'http://localhost:8080/listFiles',
            {form: {filespath : 'sunny19@yahoo.co/'}},
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(400, response.statusCode);
                    done();
                }
            }
        );
    });


    it('Should logout user from the system', function (done) {
        request.post(
            'http://localhost:8080/logout',
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should not logout user from the system', function (done) {
        request.post(
            'http://localhost:8080/logout',
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(400, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Get user details', function (done) {
        request.post(
            'http://localhost:8080/getUserDetails',
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Get user details - fail', function (done) {
        request.post(
            'http://localhost:8080/getUserDetails',
            function (error, response, body) {
                if(error){
                    console.log(error);
                }else{
                    assert.equal(400, response.statusCode);
                    done();
                }
            }
        );
    });

    //
    //
    // it('Get Sold Items Page', function (done) {
    //     http.get('http://localhost:3000/rendersoldHistoryPage', function (res) {
    //         assert.equal(200, res.statusCode);
    //         done();
    //     });
    // });
    //
    // it('Get Order/Purchase History Page', function (done) {
    //     http.get('http://localhost:3000/renderOrderHistoryPage', function (res) {
    //         assert.equal(200, res.statusCode);
    //         done();
    //     });
    // });
    //
    // it('CheckOut API', function (done) {
    //     http.get('http://localhost:3000/checkout', function (res) {
    //         assert.equal(200, res.statusCode);
    //         done();
    //     });
    // });
    //
    // it('Post item for Sale Page', function (done) {
    //     http.get('http://localhost:3000/displaySellItemPage', function (res) {
    //         assert.equal(200, res.statusCode);
    //         done();
    //     });
    // });
    //

});