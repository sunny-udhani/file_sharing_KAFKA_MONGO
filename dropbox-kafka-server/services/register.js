var User = require('../models/user');
var fs = require('fs');

exports.register = function (data, callback) {
    var user = new User();

    user.username = data.email;
    user.userEmail = data.email;
    user.userFirstName = data.fn;
    user.userLastName = data.ln;
    user.userBDate = data.bdate;
    user.userPassword = data.pwd;
    user.userWork = data.work;
    user.userEducation = data.edu;
    user.userInterests = data.inter;
    user.lastlogin = Date.now();
    user.userGender = data.gender;

    user.save(function (err) {
            if (err) {
                console.log("error in registration");
                console.log(JSON.stringify(err));
                callback(err);
            }
            else {
                console.log(user);
                if (user.username !== null || user.username !== undefined) {

                    var dir = './' + user.username;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    callback(null, user);
                }
            }
        }
    );
};
