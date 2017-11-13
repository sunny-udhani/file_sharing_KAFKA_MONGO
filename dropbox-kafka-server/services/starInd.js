var FileDetails = require('../models/fileDetails');
var ObjectId = require("mongoose").Types.ObjectId;

exports.star = function (message, callback) {
    console.log("star file");
    var fileId = message.file;
    var fileStarInd = message.starInd;
    console.log(fileId);
    console.log(fileStarInd);

    if (fileId !== null || fileId !== "" || fileStarInd !== "" || fileStarInd !== null) {

        FileDetails.findOneAndUpdate({_id: new ObjectId(fileId)}, {fileStarInd: fileStarInd}, function (err, results) {
            if (err) {

                console.log("err");
                console.log(err);
                callback(err, null);

            } else {
                if (results) {
                    console.log(results);
                    callback(null, results);

                } else {
                    callback(null, null)
                }
            }
        })
    }
};
