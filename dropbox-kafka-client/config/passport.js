var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var req_topics = require("./topic_enum").req_topic_names;
var res_topics = require("./topic_enum").res_topic_names;
var kafkaClient = require('../routes/kafka-client/kafkaClient');

module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
            usernameField: 'inputUsername',
            passwordField: 'inputPassword'
        },
        function (username, password, done) {
            console.log('in passport');
            var msg_payload = {
                email: username,
                pwd: password
            };
            kafkaClient.make_request(req_topics.LOGIN, res_topics.LOGIN, msg_payload, function (err, results) {
                console.log('in result');
                console.log(results);
                if (err) {
                    done(err, {});
                }
                else {
                    if (results.status === 200) {
                        done(null, results);
                    }
                    else {
                        done(null, false);
                    }
                }
            });
        })
    )
};