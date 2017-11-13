var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileShareSchema = new Schema({
    fromUserId: {type : Schema.Types.ObjectId, ref : 'User'},
    toUserId: {type : Schema.Types.ObjectId, ref : 'User'},
    fileDetailsId: {type : Schema.Types.ObjectId, ref : 'FileDetails'}
});

var FileShare = mongoose.model('FileShare', FileShareSchema);

module.exports = FileShare;