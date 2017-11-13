var mongo = require("../config/mongo");
var async = require("async");
var ObjectId = require('mongodb').ObjectId;
var date = require('mongodb').Date;
var mongoClient = require("../config/mongo").connect("mongodb://localhost:27017/dropbox");

exports.createGroup = function (message, callback) {

    var groupname = message.group;
    var userId = message.userId;
    var username = message.username;

    console.log("createGroup");
    console.log(groupname);
    console.log(userId);

    var groups = mongo.collection("groups");

    groups
        .findOne({
                groupName: groupname,
                groupOwnerUserId: new ObjectId(userId)
            }, function (err, results) {
                console.log(results);
                if (err) {
                    callback(err, null)
                }
                else {
                    if (results !== null && results.length > 0) {
                        callback(null, null)
                    } else {
                        groups.insertOne({
                            groupName: groupname,
                            groupOwnerUserId: new ObjectId(userId),
                            memberIds: [username]
                        }, function (err, results1) {
                            console.log(results1);
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, results1);
                            }
                        })
                    }
                }
            }
        )
};

exports.addMembersToGroup = function (message, callback) {

    var groupid = message.group;
    var memberEmailArr = message.members;

    console.log("add members to group");
    console.log(groupid);
    console.log(memberEmailArr);

    var groups = mongo.collection('groups');

    groups
        .findOne({
            _id: new ObjectId(groupid)
        }, function (err, results) {
            if (err) {
                callback(err, null)
            }
            else {
                if (results === null) {
                    callback(null, null)
                } else {
                    groups.find({
                        _id: groupid,
                        memberIds: {$all: memberEmailArr}
                    }).toArray(function (err, results1) {
                        if (err) {
                            callback(err);

                        } else {

                            console.log("find if group is there and if they are already members");
                            console.log(results1);
                            if (results1.length === 0) {
                                groups
                                    .update({
                                        _id: new ObjectId(groupid)
                                    }, {
                                        $push: {
                                            memberIds: {
                                                $each: memberEmailArr
                                            }
                                        }
                                    }, function (err, results2) {

                                        console.log("update result");

                                        console.log(results2);
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null, results2)
                                        }
                                    })
                            } else {
                                callback(null, null);
                            }
                        }
                    });
                }
            }
        })
};

exports.groupShareFileUpload = function (message, callback) {
    var groupid = message.group;
    var userEmail = message.useremail;
    var fileData = message.fileChunk;
    var fileName = message.filename;

    console.log("group file upload");
    console.log(groupid);
    console.log(userEmail);
    console.log(fileName);

    var groups = mongo.collection('groups');
    if (groupid !== null && groupid !== '') {
        groups
            .findOne({
                _id: new ObjectId(groupid),
                memberIds: userEmail
            }, function (err, results) {

                console.log(results);

                if (err) {
                    callback(err, null)
                }
                else {

                    if (results === null || results.length === 0) {
                        callback(null, null)
                    } else {

                        groups.update({_id: new ObjectId(groupid)}, {
                            $push: {
                                files: {
                                    fileId: new ObjectId(),
                                    fileName: fileName,
                                    fileCreatedDt: Date.now(),
                                    fileType: 0,
                                    fileData: fileData,
                                    fileStarInd: 0,
                                    fileUploadedBy: userEmail,
                                }
                            }
                        }, function (err, results1) {
                            console.log(results1);
                            console.log("after update");
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, results1);
                            }
                        })
                    }
                }
            })
    }
};

exports.listUserGroups = function (message, callback) {

    var userEmail = message.useremail;

    console.log("list groups");
    console.log(userEmail);

    var groups = mongo.collection('groups');

    groups
        .find({
            memberIds: userEmail
        }).toArray(function (err, results) {

        console.log(results);
        console.log("result1");

        if (err) {
            callback(err, null)
        }
        else {

            if (results.length === 0) {
                callback(null, null)
            } else {
                callback(null, results)
            }
        }
    })
};

exports.listGroupFiles = function (message, callback) {

    var groupId = message.group;

    console.log("list group files");
    console.log(groupId);

    var groups = mongo.collection('groups');

    groups
        .find({
            _id: new ObjectId(groupId)
        }, {files: 1}).toArray(function (err, results) {

        console.log(results);
        console.log("results - group file list");

        if (err) {
            callback(err, null)
        }
        else {
            if (results.length > 0) {
                if (results[0].files === null || results[0].files === undefined || results[0].files.length < 1) {
                    callback(null, null)
                } else {
                    callback(null, results[0])
                }
            }
        }
    })
};

exports.listGroupMembers = function (message, callback) {

    var groupId = message.group;

    console.log("list group members");
    console.log(groupId);

    var groups = mongo.collection('groups');

    groups
        .find({
            _id: new ObjectId(groupId)
        }, {memberIds: 1}).toArray(function (err, results) {

        console.log(results);
        console.log("results - group members");

        if (err) {
            callback(err, null)
        }
        else {
            if (results.length > 0) {
                if (results[0].memberIds === null || results[0].memberIds === undefined || results[0].memberIds.length < 1) {
                    callback(null, null)
                } else {
                    var groupMemberList = [];
                    var users = mongo.collection('users');

                    async.forEachOf(results[0].memberIds, function (member, index, cb) {
                        if (member !== "") {
                            users.findOne({userEmail: member}, function (err, result1) {
                                if (err) {
                                    cb(err);
                                } else {
                                    console.log(result1);
                                    if (result1 !== null && result1._id !== null) {
                                        groupMemberList[index] = result1;
                                        cb();
                                    } else {
                                        cb();
                                    }
                                }
                            })
                        }
                    }, function (err) {
                        if (err) {
                            callback(err)
                        } else {
                            callback(null, groupMemberList);
                        }
                    })
                }
            }
        }
    })
};