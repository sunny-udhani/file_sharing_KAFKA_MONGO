var mysql = require('../config/MySQL');
var User = require('../models/user');
var FileDetails = require('../models/fileDetails');
var FileShare = require('../models/fileshare');
var uuidv4 = require("uuid/v4");

var self = this;

exports.register = function (email, password, fn, ln, dob, gender, edu, work, inter, callback) {
    var user = new User();
    user.username = email;
    user.userEmail = email;
    user.userFirstName = fn;
    user.userLastName = ln;
    user.userBDate = dob;
    user.userPassword = password;
    user.userWork = work;
    user.userEducation = edu;
    user.userInterests = inter;
    user.lastlogin = Date.now();
    user.userGender = gender;

    user.save(function (err) {
        if (err) {
            console.log(JSON.stringify(err));
            callback(err);
        }
        else {
            console.log(user);
            callback(null, user);
        }
    });
};

exports.getUserDetails = function (email, callback) {


    User.find({userEmail: email}, function (err, results) {
        if (err) {
            console.log('error in login');
            callback(err, results);
        } else {
            callback(null, results);
        }
    })

    // var getUser = "select * from users where userEmail='" + email + "'";
    //
    // mysql.fetchData(function (err, results) {
    //     if (err) {
    //         console.log('error in login');
    //         callback(err, results);
    //     } else {
    //         callback(err, results);
    //     }
    // }, getUser);
};

exports.insertFileDetails = function (fileID, fileName, path, callback) {

    var filedetails = "insert into filedetails (fileDetailsID, fileName, fileCreatedDt, filePath, fileType) values ('" + fileID + "', '" + fileName + "', '" + new Date().toISOString().slice(0, 10) + "' , '" + path + "' , '0')";

    mysql.saveData(filedetails, function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    });
};

exports.insertUserFileRelation = function (relationID, fileID, userID, callback) {

    var relationdetails = "insert into userfile_relation (userFile_relationID, userfile_UserID, userfile_fileID) values ('" + relationID + "', '" + userID + "', '" + fileID + "')";

    mysql.saveData(relationdetails, function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    });
};

exports.saveFileDetails = function (username, fileNames, path, callback) {
    try {
        this.getUserDetails(username, function (err, result) {
            if (err) {
                throw err;
            } else {
                if (result.length === 1) {
                    var userID = result[0].userId;
                    filenameArr = fileNames.split('/');
                    filenameArr.map(function (fileName) {
                        if (fileName !== "") {
                            var pk_Id = uuidv4();
                            self.insertFileDetails(pk_Id, fileName, path, function (err, results) {
                                if (!err) {
                                    var relID = uuidv4();

                                    self.insertUserFileRelation(relID, pk_Id, userID, function (err, results) {
                                        if (!err) callback(200);
                                        else callback(400);
                                    })
                                } else {
                                    callback(400)
                                }
                            })
                        }
                    })
                } else {
                    callback(400)
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        callback(400)
    }
};

//
// exports.listUserFiles = function(username,callback){
//     try{
//         this.getUserDetails(username,function (err,result) {
//             if(err){
//                 throw err;
//             }else {
//                 if(result.length === 1){
//                     var userID = result[0].userId;
//                     self.listUserFilesRelation(userID,function (err, results) {
//                         if(!err){
//                            ) { if(results.length > 0 ){
//                                     self.listfileDetails(results, function (err, fileList
//                                     callback(err,fileList);
//                                 })
//                             }else{
//                                 console.log("no results2");
//
//                                 throw err
//                             }
//                         }else{
//                             console.log("no results3");
//
//                             throw err;
//                         }
//                     })
//                 }else{
//                     console.log("no results4");
//                     throw err
//                 }
//             }
//         })
//     }
//     catch(err){
//         console.log(err);
//         callback(err);
//     }
// };

exports.listUserFilesRelation = function (userID, callback) {
    var getFileIDs = "select userfile_fileID from userfile_relation where userfile_UserID='" + userID + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    }, getFileIDs);
};

exports.listUserFileDetails = function (fileID, path, callback) {
    var getFileDetails = "select * from filedetails where fileDetailsID = '" + fileID + "'";
    if (path === "" || path === undefined || path === null) {
    } else {
        getFileDetails += " and filePath = '" + path + "'";
    }

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    }, getFileDetails);
};

exports.saveFolder = function (username, path, dirName, callback) {
    try {
        this.getUserDetails(username, function (err, result) {
            if (err) {
                throw err;
            } else {
                if (result.length === 1) {
                    var userID = result[0].userId;
                    if (dirName !== "" && path !== "") {
                        var pk_Id = uuidv4();
                        self.insertFolder(pk_Id, dirName, path, function (err, results) {
                            if (!err) {
                                var relID = uuidv4();
                                self.insertUserFileRelation(relID, pk_Id, userID, function (err, results1) {
                                    if (!err) callback(200);
                                    else callback(400);
                                })
                            } else {
                                callback(400)
                            }
                        })
                    }
                } else {
                    callback(400)
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        callback(400)
    }
};

exports.insertFolder = function (id, name, path, callback) {
    var folderDet = "insert into filedetails (fileDetailsID, fileName, fileCreatedDt, fileType, filePath) values ('" + id + "', '" + name + "', '" + new Date().toISOString().slice(0, 10) + "' , 1, '" + path + "')";

    mysql.saveData(folderDet, function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    });
};

exports.insertShareDetails = function (fromUserId, toUserId, fileId, callback) {
    var unique_Id = uuidv4();
    var shareQuery = "insert into fileshare (fileShareId, usersId, fileDetailsId, fromUserId) values ('" + unique_Id + "', '" + toUserId + "', '" + fileId + "' , '" + fromUserId + "')";

    mysql.saveData(shareQuery, function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    });
};

exports.listSharedFilesId = function (userID, callback) {
    var getFileIDs = "select fileDetailsId from fileshare where usersId='" + userID + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    }, getFileIDs);
};

exports.fetchUser = function (username, callback) {
    var getUser = "select * from users where userEmail='" + username + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    }, getUser);
};

exports.starFileUpdate = function (fileId, value, callback) {
    var getUser = "update fileDetails set fileStarInd = " + value + " where fileDetailsId = '" + fileId + "' ";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(err, results);
        }
    }, getUser);
};