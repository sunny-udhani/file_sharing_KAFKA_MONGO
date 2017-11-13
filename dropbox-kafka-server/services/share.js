var FileShare = require('../models/fileshare');

exports.insertShareDetails = function (data, callback) {
    console.log(data);
    var fileShare = new FileShare();

    fileShare.fromUserId = data.fromUserId;
    fileShare.toUserId = data.toUserId;
    fileShare.fileDetailsId = data.file;

    fileShare.save(function (err) {
            if (err) {
                console.log(JSON.stringify(err));
                callback(err);
            }
            else {
                console.log(fileShare);
                callback(null, fileShare);

            }
        }
    );
};
