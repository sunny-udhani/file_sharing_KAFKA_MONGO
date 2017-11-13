var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;


/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url){
    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(connected +" is connected?");
        return db;
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};

//
// var poolSize = 10;
// var queueSize = 10;
//
// var pool = [];
// var queue = [];
// var queueCount = 0;
//
// var queueNotifier = new Map();
//
//
// function CreateConnectionPool() {
//
//     for (var i = 0; i < poolSize; i++) {
//         var connection = mongoose.connect(dbURI);
//         pool.push(connection);
//     }
//     console.log(pool[0]);
//     return this;
// }
//
// function getConnection(callback) {
//
//     console.log("connection requested");
//
//     if (isConnectionFree()) {
//
//         console.log("connection free");
//         callback(pool.pop());
//
//
//     } else {
//
//         console.log("connection not free");
//         if (isQueueFree()) {
//
//             console.log('in queue');
//             queue.push(queueCount);
//             queueNotifier.set(queueCount, false);
//             token = queueCount;
//             queueCount++;
//             waitInQueue(token, function (conn) {
//                 callback(conn)
//             });
//
//         } else {
//
//             console.log('queue not free');
//             return null;
//         }
//     }
// }
//
// function waitInQueue(token, callback) {
//
//     while (!queueNotifier.get(token)) {
//
//         if (queueNotifier.get(token)) {
//             if (isConnectionFree()) {
//                 console.log('waiting');
//                 // return (pool.pop());
//                 callback(pool.pop());
//             }
//         }
//
//     }
//
// }
//
// function releaseConnection(connection) {
//
//     pool.push(connection);
//     console.log('connection released');
//     queueNotifier.set(queue.pop(), true);
//     queue.shift();
//
// }
//
// function isConnectionFree() {
//
//     return pool.length > 0;
//
// }
//
// function isQueueFree() {
//
//     return queue.length < queueSize;
// }
//
// exports.CreateConnectionPool = CreateConnectionPool;
// exports.getConnection = getConnection;
// exports.releaseConnection = releaseConnection;
