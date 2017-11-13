var FileDetails = require('../models/fileDetails');
var fs = require('fs');
var util = require('./util');

exports.makeDirectory = function (data, callback) {
    console.log("aaj login");
    console.log(data);

    util.validateFolderExists(data.path, function (status) {
        if (status === 200) {
            util.validateFolderExists(data.path + "/" + data.dirName, function (status1) {
                if (status1 === 400) {
                    fs.mkdirSync(data.path + '/' + data.dirName);
                    if (fs.existsSync(data.path + '/' + data.dirName)) {
                        callback(null, data)
                    }
                } else {
                    console.log("not making dir");
                    callback(data, null);
                }
            })
        } else {
            console.log("path not exist")
            callback(data, null);
        }

    });
};

exports.saveDirectory = function (data, callback) {
    console.log(data);

    if (data.dirName !== "" || data.dirName !== undefined) {
        var folder = new FileDetails();
        folder.fileName = data.dirName;
        folder.filePath = data.path;
        folder.fileType = 1;
        folder.userId = data.userId;
        folder.fileStarInd = 0;
        folder.fileCreatedDt = Date.now();

        console.log(folder);

        folder.save(function (err) {
            if (err) {
                console.log(JSON.stringify(err));
                callback(err);
            }
            else {
                callback(null, folder);
            }
        });
    } else {
        callback(data, null)
    }
};
