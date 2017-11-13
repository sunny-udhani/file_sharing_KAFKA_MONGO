var fs = require('fs');

exports.validateFolderExists = function (path,callback) {
    console.log("validating path: " + path)
    if(path === undefined){
        console.log("khaaali path")
        callback(400);
    }
    var dir = './' + path;

    if (!fs.existsSync(dir)){
console.log("path doesnt exist");
        callback(400)
    }else{
        callback(200)
    }
};
