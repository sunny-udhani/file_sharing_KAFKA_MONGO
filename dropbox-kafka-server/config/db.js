var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost:27017/dropbox';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI, {useMongoClient: true, poolSize: 10});

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app termination', function () {
        process.exit(0);
    });
});

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
