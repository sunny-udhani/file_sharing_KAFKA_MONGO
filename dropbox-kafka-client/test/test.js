var request = require('request'), express = require('express'), assert = require("assert"),
    filename = 'x.png';
boundary = Math.random();

var fs = require('fs');
describe('http API tests', function () {

    it('Should create a directory based on input', function (done) {
        request.post(
            'http://localhost:8080/makeDirectory',
            {
                form: {"dir": "tstDir", "path": "./sunny_iv09@yahoo.com"}
            },
            function (error, response, body) {
                console.log(error)
                console.log(response.statusCode)
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('Should not create a directory based on input', function (done) {
        request.post(
            'http://localhost:8080/makeDirectory',
            {
                form: {"dir": "tstDir", "path": "./sunny_iv09@yahoo.com"}
            },
            function (error, response, body) {
                assert.equal(400, response.statusCode);
                done();
            }
        );
    });

    it('Should share a file based on inputs', function (done) {
        request.post(
            'http://localhost:8080/share',
            {
                form: {
                    emails: 'aajsnny@sjsu.gov',
                    fileId: '59f9a43c5d4c1724d014f5bc'
                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should not share a file based on inputs', function (done) {
        request.post(
            'http://localhost:8080/share',
            {
                form: {
                    emails: 'aajsnny@sjsu.gov',
                    fileId: '59f-a43c5d4c1724d014f5bc'
                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    assert.equal(400, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should change star indicator based on input', function (done) {
        request.post(
            'http://localhost:8080/starFile',
            {
                form: {
                    value: '1',
                    id: '59f9a43c5d4c1724d014f5bc'
                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should not change star indicator based on input', function (done) {
        request.post(
            'http://localhost:8080/starFile',
            {
                form: {
                    value: '1',
                    id: '59f9843c5d4c1724d014f5bc' // incorrect file id
                }
            },
            function (error, response, body) {
                console.log(response.statusCode);

                if (error) {
                    console.log(error);
                } else {
                    assert.equal(400, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should create a group', function (done) {
        request.post(
            'http://localhost:8080/createGroup',
            {
                form: {
                    "groupname": "testingGroups1" // incorrect file id
                }
            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    assert.equal(200, response.statusCode);
                    done();
                }
            }
        );
    });

    it('Should not create a group', function (done) {
        request.post(
            'http://localhost:8080/logout',
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    if (response.statusCode === 200) {
                        console.log(response.statusCode)
                        request.post(
                            'http://localhost:8080/createGroup',
                            {
                                form: {
                                    "groupname": "testingGroups1" // incorrect file id
                                }
                            }, function (error, response, body) {
                                console.log("response for create");
                                console.log(response.statusCode)
                                if (error) {
                                    console.log(error);
                                } else {
                                    assert.equal(400, response.statusCode);
                                    done();
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    it('Should list members of group', function (done) {
        request.post(
            'http://localhost:8080/selectGroup',
            {
                form: {
                    groupId: "5a082180fec20727dc8d86d0"
                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    if (response.statusCode === 200) {
                        request.post(
                            'http://localhost:8080/listGroupMembers',
                            function (error, response, body) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    assert.equal(200, response.statusCode);
                                    done();
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    it('Get not list members of group', function (done) {
        request.post(
            'http://localhost:8080/logout',
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    if (response.statusCode === 200) {
                        request.post(
                            'http://localhost:8080/listGroupMembers',
                            function (error, response, body) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    assert.equal(400, response.statusCode);
                                    done();
                                }
                            }
                        );
                    }
                }
            }
        );
    });
});