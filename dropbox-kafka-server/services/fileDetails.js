var async = require("async");
var validateFolder = require('./util').validateFolderExists;
var FileDetails = require('../models/fileDetails');
var SharedFiles = require('../models/fileshare');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getFileList = function (message, callback) {

    var filePath = message.filepath;
    var sharePath = message.sharepath;
    var userId = message.userId;
    var userName = message.username;

    validateFolder(userName, function (resultInd) {
        console.log("validation result: " + resultInd);
        if (resultInd === 200) {

            if (filePath === "" || filePath === undefined) {
                filePath = "./" + userName;
            }
//userId: userId, filePath : filePath
            FileDetails
                .find({userId: new ObjectId(userId), filePath: filePath}, function (err, results) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                    else {
                        console.log(results);
                        if (results.length > 0) {
                            var fileList = [{fileName: '..', filePath: filePath}];
                            results.map(function (file, index) {
                                fileList[index + 1] = file;
                            })
                            callback(null, fileList);
                        } else {
                            callback(null, results);
                        }
                    }
                });

        } else {
            callback(null, null)
        }
    })
};

exports.getSharedFileList = function (message, callback) {
    var sharePath = message.sharepath;
    var userId = message.userId;
    var userName = message.username;
    console.log("in share get files");

    SharedFiles
        .find({toUserId: new ObjectId(userId)}, function (err, results) {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {
                console.log(results);

                if (results.length > 0) {

                    var sharedFileList = [];
                    var innerFlag = false;
                    if(sharePath === undefined || sharePath === null){
                        sharedFileList = [{fileName: '..', filePath: sharePath}]
                        innerFlag = true;
                     }

                    async.forEachOf(results, function (file, index, cb) {
                    if (file !== "") {
                        FileDetails.findOne({_id : new ObjectId(file.fileDetailsId)}, function (err,result1) {
                            if(err){
                                cb(err);
                            }else{
                                console.log(result1);
                                if(result1!== null && result1._id !== null){
                                    if(innerFlag)
                                    sharedFileList[index +1] = result1;
                                    else
                                        sharedFileList[index] = result1;
                                    cb();
                                }else{
                                    cb();
                                }
                            }
                        })
                    }
                }, function (err) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, sharedFileList);
                    }
                })
                } else {
                    callback(null, null);
                }
            }
        });

};