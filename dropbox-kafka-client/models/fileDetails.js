var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileDetailsSchema = new Schema({
    fileName: {type: String},
    fileCreatedDt: {type: String},
    fileDeletedDt: {type: String},
    fileSharedDt: {type: String},
    fileType: {type: String},
    filePath: {type: String},
    fileStarInd: {type: String},
    userId : {type : Schema.Types.ObjectId, ref : 'User'}
});

var FileDetails = mongoose.model('FileDetails', FileDetailsSchema);


module.exports = FileDetails;