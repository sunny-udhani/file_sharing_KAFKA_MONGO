var multer = require("multer");
var fs = require('fs');
var async = require("async");
var FileDetails = require('../models/fileDetails');
var fileName = "";
var self = this;
var uploadPath = "";

exports.fileUpload = function (message, callback) {
    console.log("file upload");
    var filedata = message.fileChunk;
    var filename = message.fileName;
    var userId = message.userId;
    console.log(filename);
    console.log(userId);

    var fileDetails = new FileDetails();

    fileDetails.fileName = filename;
    fileDetails.fileCreatedDt = Date.now();
    fileDetails.filePath = uploadPath;
    fileDetails.fileType = 0;
    fileDetails.fileStarInd = 0;
    fileDetails.userId = userId ;

    // const buf = Buffer.from(filedata, 'utf8');
    // console.log(buf);

    var uploadPathx = uploadPath + "/" + filename;

    if (filedata !== null || filename !== null) {
        console.log(uploadPath + "/" + filename);

        var options = {encoding: 'utf8'};
        var wstream = fs.createWriteStream(uploadPathx, options);
// OR add the encoding to each write
        wstream.write(filedata, function () {
            console.log("complete write");
            wstream.close();
            fileDetails.save(function (err) {
                if (err) {
                    console.log(JSON.stringify(err));
                    callback(err);
                }
                else {
                    callback(null, fileDetails)
                }
            });
        });
    }

        // fs.writeFile("./" + uploadPath + "/" + filename, buf, function (err) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log("file dekh");
        //     callback(null, 'done')
        // })

        // if (err) {
        //     console.log("no filedata.file:");
        //     res.status(400).send();
        // }
        // else {
        //     console.log(fileName);
        //     mysqlDAO.saveFileDetails(filedata.aaj.username, fileName, uploadPath, function (result) {
        //         res.status(result).send();
        //         fileName = "";
        //     })
        // }
};

exports.setUploadPath = function (message, callback) {
    console.log(message);
    uploadPath = message.uploadPath;

    console.log("upload path is set-------------");
    console.log(uploadPath);

    callback(null, uploadPath)
};