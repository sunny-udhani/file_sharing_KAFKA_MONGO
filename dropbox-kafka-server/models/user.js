var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    userFirstName: {type: String},
    userLastName: {type: String},
    userEmail: {type: String, required: true, unique: true},
    userBDate: {type: Date, default: ''},
    userPassword: {type: String, required: true},
    userWork: {type: String, default: ''},
    userEducation: {type: String, default: ''},
    userInterests: {type: String, default: ''},
    userContact: {type: String, default: ''},
    lastlogin: {type: String, default: ''},
    userGender: {type: String, default: ''}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;