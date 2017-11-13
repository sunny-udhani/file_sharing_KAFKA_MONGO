var ejs = require("ejs");
var passport = require('passport');

var req_topics = require("../config/topic_enum").req_topic_names;
var res_topics = require("../config/topic_enum").res_topic_names;

var mysqlDAO = require('./dropboxDAO');
var kafkaClient = require('./kafka-client/kafkaClient');
var bcrypt = require('bcrypt-nodejs');
var multer = require("multer");
var fs = require('fs');
var async = require("async");
var Busboy = require('busboy');
var fileName = "";
var self = this;
var uploadPath = "";
var inspect = require('util').inspect;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, ('./' + uploadPath))
    },
    filename: function (req, file, cb) {
        fileName += file.originalname + "/";
        cb(null, file.originalname)
    }
});

var upload = multer({storage: storage}).any();

exports.registerUser = function (req, res) {

    var id = req.param("userEmail");
    var pwd = bcrypt.hashSync(req.param("password"));
    var fn = req.param("firstName");
    var ln = req.param("lastName");
    var bdate = req.param("dob");
    var gender = req.param("gender");
    var edu = req.param("edu");
    var work = req.param("work");
    var inter = req.param("inter");

    var msg_payload = {
        id: id,
        email: id,
        fn: fn,
        bdate: bdate,
        gender: gender,
        edu: edu,
        work: work,
        inter: inter,
        pwd: pwd
    };

    kafkaClient.make_request(req_topics.REGISTER, res_topics.REGISTER, msg_payload, function (err, result) {
        console.log(err);
        console.log(result);

        if (err) {
            res.status(400).send();
        }
        else {
            res.status(200).send(result)
        }
    });

    // mysqlDAO.register(id,pwd,fn,ln,bdate,gender,edu,work, inter, function(err,results){
    //     if(!err){
    //         if (results.username !== null || results.username !== undefined) {
    //             req.aaj.username = id;
    //             req.aaj.isLoggedIn = true;
    //
    //             var dir = './' + id;
    //
    //             if (!fs.existsSync(dir)){
    //                 fs.mkdirSync(dir);
    //             }
    //             console.log("valid registration");
    //             res.status(200).json({"results": results});
    //         }
    //         else {
    //             req.aaj.destroy();
    //             console.log('Session Destroyed');
    //             console.log("Error occurred");
    //             res.status(400).send(err);
    //         }
    //     }else{
    //         console.log("error on register:" + err);
    //         res.status(500);
    //         res.end("Invalid login");
    //     }
    // });
};

exports.validateLogin = function (req, res) {

    console.log("passport call");
    passport.authenticate('login', function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        if (!results) {
            res.status(401).send();
        } else {
            req.session.username = results.data.username;
            req.session.userId = results.data._id;
            console.log(req.session.username);
            console.log("session initialized");
            return res.status(200).send(results.data);
        }
    })(req, res);
};

exports.logout = function (req, res) {
    console.log(req.session.username);
    if (req.session.username !== undefined || req.session.username !== "" || req.session.username !== null) {
        console.log(req.session.username);

        var msg_payload = {
            email: req.session.username
        };

        kafkaClient.make_request(req_topics.LOGOUT, res_topics.LOGOUT, msg_payload, function (err, result) {
            console.log(err);
            console.log(result);

            req.session.destroy();
            console.log('Session Destroyed');
            res.status(200).send();
        });
    }
    //     req.session.destroy();
    // console.log('Session Destroyed');
    // res.status(200).send();

};

validateFolderExists = function (path, callback) {
    if (path === undefined) {
        callback(400);
    }
    var dir = './' + path;

    if (!fs.existsSync(dir)) {
        callback(400)
    } else {
        callback(200)
    }
};

exports.fileUpload = function (req, res) {
    var filePayload = {
        fileChunk: '',
        userId: '',
        fileName: null
    };

    try {
        if (req.session.username !== undefined || req.session.username !== "") {
            filePayload.userId = req.session.userId;

            var busboy = new Busboy({headers: req.headers});
            var files = 0, finished = false;

            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                ++files;
                console.log(encoding);
                console.log(mimetype);
                filePayload.fileName = filename;

                file.on('data', function (data) {

                    console.log('File [' + fieldname + '] got ' + data.length + ' bytes');

                    filePayload.fileChunk += new Buffer(data, 'utf8');
                });

                file.on('end', function () {
                    console.log(filePayload.fileChunk);

                    console.log('File [' + fieldname + '] got data completely');
                    kafkaClient.make_request(req_topics.UPLOAD_FILES, res_topics.UPLOAD_FILES, filePayload, function (err, result) {
                        console.log(err);
                        console.log(result);

                        if (err) {
                            res.status(400).send();
                        }
                        else {
                            if (--files === 0 && finished) res.status(200).send()
                        }
                    });
                });
            });

            busboy.on('finish', function () {
                finished = true;
            });
            req.pipe(busboy);

        } else {
            res.status(500).send();
        }
    } catch (err) {
        console.log('error : ' + err);
        res.status(500).send();

    }
};

exports.listFiles = function (req, res) {

    if (req.session.username !== undefined || req.session.username !== "") {
        console.log("file path -- " + req.body.filespath);
        console.log("share file path -- " + req.body.sharePath);

        var msg_payload = {
            filepath: req.body.filespath,
            sharepath: req.body.sharePath,
            userId: req.session.userId,
            username: req.session.username
        };

        console.log(msg_payload);

        kafkaClient.make_request(req_topics.LIST_FILES.USER_FILES, res_topics.LIST_FILES.USER_FILES, msg_payload, function (err, result) {
            if (err) {
                res.status(400).send();
            }
            else {
                var user_uploaded_files = [];
                if (result.data !== null) {
                    user_uploaded_files = result.data;
                }
                kafkaClient.make_request(req_topics.LIST_FILES.SHARED_FILES, res_topics.LIST_FILES.SHARED_FILES, msg_payload, function (err, result1) {
                    if (err) {
                        res.status(400).send();
                    }
                    else {
                        var user_shared_files = [{name: null}];
                        console.log(result1.data);
                        if (result1.data !== null) {
                            user_shared_files = result1.data;
                        }
                        var response_payload = {userFileList: user_uploaded_files, sharedFileList: user_shared_files};
                        res.status(200).send(response_payload);
                    }
                })
            }
        })

        // validateFolderExists(req.aaj.username, function (folderExists) {
        //     if (folderExists === 200) {
        //         console.log("filespath : " + req.param("filesPath"));
        //         var filepath = req.param("filesPath");
        //         if (filepath === "" || filepath === undefined) {
        //             filepath = "./" + req.aaj.username;
        //         }
        //
        //         var sharepath = req.param("sharePath");
        //
        //         listUserFiles(req, filepath, function (err, fileList) {
        //             if (err) {
        //                 throw err;
        //             } else {
        //                 fileList = fileList.sort(function (a, b) {
        //                     if (a.fileType > b.fileType) {
        //                         return -1;
        //                     } else if (a.fileType > b.fileType) {
        //                         return 1;
        //                     } else {
        //                         return 0;
        //                     }
        //                 });
        //                 console.log(fileList);
        //                 listSharedFiles(req, sharepath, function (err, sharedFilesList) {
        //                     if (err) {
        //                         throw err;
        //                     } else {
        //                         var result = {userFileList: fileList, sharedFileList: sharedFilesList};
        //                         res.status(200).send(result);
        //                     }
        //                 });
        //             }
        //         });
        //     } else {
        //         res.status(400).end();
        //     }
        // })

    } else {
        res.status(400).send();
    }
};

exports.makeDirectory = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        console.log(req.body.path);
        console.log(req.body.dir);
        var path = req.body.path;
        var dir = req.body.dir;
        if (path === "" || path === undefined) {
            path = "./" + req.session.username;
        }
        var msg_payload = {path: path, dirName: dir, userId: req.session.userId};

        kafkaClient.make_request(req_topics.MAKE_DIRECTORY, res_topics.MAKE_DIRECTORY, msg_payload, function (err, result) {
            if (err) {
                res.status(400).send();
            }
            else {
                kafkaClient.make_request(req_topics.SAVE_DIRECTORY, res_topics.SAVE_DIRECTORY, msg_payload, function (err, result1) {
                    if (err) {
                        res.status(400).send();
                    }
                    else {
                        res.status(200).send();
                    }
                })
            }

        })
    }
    //     var createPath = path + '/' + dir;
    //     fs.mkdirSync(createPath);
    //     if (!fs.existsSync(createPath)) {
    //         res.status(400).end();
    //     } else {
    //         mysqlDAO.saveFolder(req.session.username, path, req.param('dir'), function (results) {
    //             if (results === 200) res.status(200).send();
    //         })
    //     }
    // } else {
    //     res.status(400).end();
    // }
};

exports.setPath = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        console.log(req);
        var path = "./" + req.session.username + "/" + req.param('path');
        if (!fs.existsSync(path)) {
            res.status(400).end();
        } else {
            self.listFiles()
        }
    } else {
        res.status(400).end();
    }
};

exports.setUploadPath = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {

        uploadPath = '';
        if (req.param('path') === null || req.param('path') === '' || req.param('path') === undefined) {
            uploadPath = './' + req.session.username;
        } else {
            uploadPath = req.param('path');
        }
        console.log("file upload file path");
        console.log(uploadPath);

        var msg_payload = {
            uploadPath: uploadPath
        };

        kafkaClient.make_request(req_topics.SET_UPLOAD_PATH, res_topics.SET_UPLOAD_PATH, msg_payload, function (err, result) {
            console.log(err);
            console.log(result);

            if (err) {
                res.status(400).send();
            }
            else {
                res.status(200).send(result)
            }
        });

        // uploadPath = '';
        // console.log("upload path set");
        // console.log(req.body);
        // if (req.param('path') === null || req.param('path') === '' || req.param('path') === undefined) {
        //     uploadPath = './' + req.aaj.username;
        // } else {
        //     uploadPath = req.param('path');
        // }
        // console.log("file upload file path");
        // console.log(uploadPath);
        // res.status(200).end();
    }
};

exports.doShare = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        console.log("input emails: " + req.param('emails'));
        var emails = req.param('emails');
        var fileId = req.param('fileId');
        var fromEmailId = req.session.userId;

        try {
            var emailArr = emails.split(';');

            async.forEachOf(emailArr, function (toEmail, index, cb) {
                if (toEmail !== "") {
                    var msg_payload = {email: toEmail};
                    kafkaClient.make_request(req_topics.GET_USER_DETAILS, res_topics.GET_USER_DETAILS, msg_payload, function (err, results) {
                        if (!err) {
                            if (results.data !== null && results.data._id !== undefined) {
                                var toUserID = results.data._id;
                                if (toUserID !== "") {
                                    var msg_payload2 = {fromUserId: fromEmailId, toUserId: toUserID, file: fileId};
                                    kafkaClient.make_request(req_topics.INSERT_SHARE_DETAILS, res_topics.INSERT_SHARE_DETAILS, msg_payload2, function (err, result1) {
                                        if (err) {
                                            cb(err);
                                        } else {
                                            cb()
                                        }
                                    })
                                } else {
                                    console.log("2");
                                }
                            } else {
                                res.status(400).send();
                            }
                        }
                    })
                }
            }, function (err) {
                if (err) {
                    console.log("err" + err);
                    res.status(400).end();
                } else {
                    res.status(200).send();
                }
            })
        }
        catch (err) {
            console.log(err);
            res.status(500).send();
        }
    }
};

listUserFiles = function (req, path, cb) {
    validateFolderExists(path, function (folderExists) {
        if (folderExists === 200) {
            mysqlDAO.getUserDetails(req.session.username, function (err, userResults) {
                if (err) {
                    throw err;
                } else {
                    if (userResults.length === 1) {
                        var userID = userResults[0]._id;
                        var fileList = [{}];
                        mysqlDAO.listUserFilesRelation(userID, function (err, relations) {
                            if (err) {
                            } else {
                                if (relations.length !== 0) {
                                    console.log("relation len: " + relations.length);
                                    async.forEachOf(relations, function (relation, index, callback) {
                                        mysqlDAO.listUserFileDetails(relation.userfile_fileID, path, function (err, fileDetails) {
                                            fileList[0] = {name: "..", path: path};
                                            if (fileDetails.length === 1) {
                                                if (fileDetails[0].fileName !== "") {
                                                    fileList[index + 1] = {
                                                        name: fileDetails[0].fileName,
                                                        createDt: fileDetails[0].fileCreatedDt,
                                                        id: fileDetails[0].fileDetailsID,
                                                        path: fileDetails[0].filePath,
                                                        type: fileDetails[0].fileType,
                                                        starInd: fileDetails[0].fileStarInd
                                                    };
                                                }
                                            }
                                            callback();
                                        })
                                    }, function (err) {
                                        //res.status(200).send(fileList)
                                        cb(err, fileList)
                                    });
                                } else {
                                    cb(err, fileList)
                                }
                            }
                        })
                    }
                }
            })
        } else {
            console.log("no such folder")
        }
    })
};

listSharedFiles = function (req, path, cb) {
    mysqlDAO.getUserDetails(req.session.username, function (err, userResults) {
        if (err) {
        } else {
            if (userResults.length === 1) {
                var userID = userResults[0]._id;
                var fileList = [{}];
                mysqlDAO.listSharedFilesId(userID, function (err, fileIds) {
                    if (err) {
                    } else {
                        if (fileIds.length !== 0) {
                            async.forEachOf(fileIds, function (file, index, callback) {
                                mysqlDAO.listUserFileDetails(file.fileDetailsId, path, function (err, fileDetails) {
                                    fileList[0] = {name: "..", path: path};
                                    if (fileDetails.length === 1) {
                                        if (fileDetails[0].fileName !== "") {
                                            fileList[index + 1] = {
                                                name: fileDetails[0].fileName,
                                                createDt: fileDetails[0].fileCreatedDt,
                                                id: fileDetails[0].fileDetailsID,
                                                path: fileDetails[0].filePath,
                                                type: fileDetails[0].fileType
                                            };
                                        }
                                    }
                                    callback();
                                })
                            }, function (err) {
                                cb(err, fileList)
                            });
                        } else {
                            cb(err, fileList)
                        }
                    }
                })
            }
        }
    })
};

exports.userDetFetch = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        mysqlDAO.fetchUser(req.session.username, function (err, results) {
            if (err) {
                res.status(400).end();
            } else {
                console.log(results);
                res.status(200).send(results);
            }
        })
    } else {
        res.status(404).end();
    }
};

exports.userdata = function (req, res) {
    var id = req.param("userEmail");
    if (id !== '' && id !== undefined && id !== null) {
        mysqlDAO.fetchUser(id, function (err, results) {
            if (err) {
                res.status(400).end();
            } else {
                console.log(results);
                res.status(200).send(results);
            }
        })
    } else {
        res.status(404).end();
    }
};

exports.starFile = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        var id = req.param("id");
        var value = req.param("value");
        if (id !== '' && id !== undefined && id !== null) {
            var msg_payload = {file: id, starInd: value};
            kafkaClient.make_request(req_topics.STAR_FILE, res_topics.STAR_FILE, msg_payload, function (err, result) {
                console.log(err);
                console.log(result);

                if (err) {
                    res.status(400).send();
                }
                else {
                    res.status(200).send(result)
                }
            });

        } else {
            res.status(400).end();
        }
    } else {
        res.status(500).send();
    }

};

exports.createGroup = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        var groupName = req.param("groupname");
        console.log(groupName);

        if (groupName !== '' && groupName !== undefined && groupName !== null) {
            var msg_payload = {group: groupName, userId: req.session.userId, username: req.session.username};
            kafkaClient.make_request(req_topics.CREATE_GROUP, res_topics.CREATE_GROUP, msg_payload, function (err, result) {
                console.log(err);
                console.log(result);

                if (err) {
                    res.status(400).send();
                }
                else {
                    res.status(200).send(result)
                }
            });


        } else {
            res.status(400).end();
        }
    } else {
        res.status(500).send();
    }
};

exports.addMemberstoGroup = function (req, res) {
    if (req.session.username !== undefined || req.session.username !== "") {
        var groupid = req.param("groupId");
        var emails = req.param("memberEmail");
        console.log(emails);
        console.log(groupid);
        var emailArr = emails.split(";");

        if ((groupid !== '' && groupid !== undefined && groupid !== null) && (emailArr.length > 0)) {
            var msg_payload = {group: groupid, members: emailArr};
            kafkaClient.make_request(req_topics.ADD_MEMBERS_GROUP, res_topics.ADD_MEMBERS_GROUP, msg_payload, function (err, result) {
                console.log(err);
                console.log(result);

                if (err) {
                    res.status(400).send();
                }
                else {
                    res.status(200).send(result)
                }

            });

        } else {
            res.status(400).end();
        }
    } else {
        res.status(500).send();
    }

};

exports.shareFilestoGroup = function (req, res) {
    var file_payload = {
        group: "",
        useremail: "",
        fileChunk: "",
        filename: ""
    };

    try {
        if ((req.session.username !== undefined || req.session.username !== "" ) && (req.session.groupId !== undefined || req.session.groupId !== "" )) {
            file_payload.group = req.session.groupId;
            file_payload.useremail = req.session.username;

            var busboy = new Busboy({headers: req.headers});
            var fileChunk = '';
            var files = 0, finished = false;
            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                ++files;
                console.log(encoding);
                console.log(mimetype);
                file_payload.filename = filename;
                file.on('data', function (data) {

                    console.log('File [' + filename + '] got ' + data.length + ' bytes');

                    fileChunk += new Buffer(data, 'utf8');
                });

                file.on('end', function () {
                    file_payload.fileChunk = fileChunk;
                    kafkaClient.make_request(req_topics.GROUP_SHARE_FILE_UPLOAD, res_topics.GROUP_SHARE_FILE_UPLOAD, file_payload, function (err, result) {
                        console.log(err);
                        console.log(result);

                        if (err) {
                            res.status(400).send();
                        }
                        else {
                            res.status(200).send(result)
                        }
                    });
                });
            });

            req.pipe(busboy);

        } else {
            res.status(500).send();
        }
    } catch (err) {
        console.log('error : ' + err);
        res.status(500).send();

    }
};

exports.listUserGroup = function (req, res) {

    try {
        if ((req.session.username !== undefined || req.session.username !== "" )) {

            var msg_payload = {useremail: req.session.username};
            kafkaClient.make_request(req_topics.LIST_GROUPS, res_topics.LIST_GROUPS, msg_payload, function (err, results) {
                if (err) {
                    res.status(400).send();
                } else {
                    res.status(200).send(results)
                }
            })
        } else {
            res.status(500).send();
        }
    } catch (err) {
        console.log('error : ' + err);
        res.status(500).send();

    }
};

exports.listGroupFiles = function (req, res) {

    try {
        if ((req.session.username !== undefined || req.session.username !== "" ) && (req.session.groupId !== undefined || req.session.groupId !== "" )) {

            var msg_payload = {group: req.session.groupId};
            kafkaClient.make_request(req_topics.LIST_GROUP_FILES, res_topics.LIST_GROUP_FILES, msg_payload, function (err, results) {
                if (err) {
                    res.status(400).send();
                } else {
                    res.status(200).send(results)
                }
            })
        } else {
            res.status(500).send();
        }
    } catch (err) {
        console.log('error : ' + err);
        res.status(500).send();

    }
};

exports.listGroupMembers = function (req, res) {

    try {
        if ((req.session.username !== undefined || req.session.username !== "" ) && (req.session.groupId !== undefined || req.session.groupId !== "" )) {

            var msg_payload = {group: req.session.groupId};
            kafkaClient.make_request(req_topics.LIST_GROUP_MEMBERS, res_topics.LIST_GROUP_MEMBERS, msg_payload, function (err, results) {
                if (err) {
                    res.status(400).send();
                } else {
                    res.status(200).send(results)
                }
            })
        } else {
            res.status(500).send();
        }
    } catch (err) {
        console.log('error : ' + err);
        res.status(500).send();

    }
};

exports.setGroup = function (req, res) {

    try {
        req.session.groupId = req.body.groupId;
        console.log(req.session.groupId);
        console.log("req.session.groupId ;");
        res.send(200).send();
    } catch (err) {
        console.log('error : ' + err);
        res.status(500).send();

    }
};