var mysql = require('./MySQL');
var bcrypt= require('bcrypt-nodejs');
var moment = require('moment');

exports.validate = function(req, res){
// check user already exists
    var pwd = (req.param("inputPassword"));
    var getUser="select * from users where userEmail='"+req.param("inputUsername")+"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else if(results[0])
        {
            console.log("results: "+results[0]);
            if(bcrypt.compareSync(pwd, results[0].userPassword))
            {
                console.log("valid Login");
                console.log("session data: "+ JSON.stringify(req.aaj));
                req.aaj.username = req.param("inputUsername");
                req.aaj.userId = results[0].userId;
                req.aaj.isLoggedIn = true;

                console.log("Session initialized: "+ JSON.stringify(req.aaj.username));

                json_responses = {"results" : results};
                res.status(200).json(json_responses);
            }
            else {
                req.aaj.destroy();
                console.log('Session Destroyed');
                console.log("Error occurred");
                res.status(400).send(err);
            }
        }
    },getUser);
};