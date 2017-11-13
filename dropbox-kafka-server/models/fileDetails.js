var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileDetailsSchema = new Schema({
    fileName: {type: String},
    fileCreatedDt: {type: Date},
    fileDeletedDt: {type: Date},
    fileSharedDt: {type: Date},
    fileType: {type: Number},
    filePath: {type: String},
    fileStarInd: {type: Number},
    userId : {type : Schema.Types.ObjectId, ref : 'User'}
});

var FileDetails = mongoose.model('FileDetails', FileDetailsSchema);


module.exports = FileDetails;