var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var multer = require("multer");
var fs = require('fs');
var util = require('./util');

exports.validateLogin = function (data, callback) {
    console.log("aaj login");
    console.log(data);
    User.findOne({userEmail: data.email}, function (err, obj) {
        console.log(obj);
        if (bcrypt.compareSync(data.pwd, obj.userPassword)) {
            util.validateFolderExists(data.email, function (folderExistsInd) {
                if (folderExistsInd === 200) {

                    console.log(obj);
                    callback(null, obj)

                } else {
                    console.log(obj);

                    var dir = './' + data.email;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    callback(null, obj)
                }
            })
        }
    });
};

exports.getUserDetails = function (data, callback) {
    console.log(data);
    User.findOne({userEmail: data.email}, function (err, obj) {

        console.log(obj);
        callback(null, obj);
    });
};
