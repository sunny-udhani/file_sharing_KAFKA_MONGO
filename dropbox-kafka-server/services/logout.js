var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var multer = require("multer");
var fs = require('fs');
var async = require("async");
var fileName = "";
var self = this;
var uploadPath = "";
var util = require('./util');

exports.handleLogout = function (data, callback) {

    User.findOneAndUpdate({userEmail: data.email}, {$set: {lastlogin: Date.now()}}, {new: true}, function (err, obj) {
        console.log(obj);
        console.log(Date.now());

        if (err) {
            callback(err, null);
        } else {
            callback(null, obj)
        }

    });
};
