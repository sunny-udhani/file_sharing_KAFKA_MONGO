var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var mongoURL = "mongodb://localhost:27017/dropbox";
var self = this;
/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(callback){
    MongoClient.connect(mongoURL, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(db +" is connected? - " + connected);
        callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
        self.connect(function (connectedDB) {
            db = connectedDB;
        })
    }
    return db.collection(name);
};