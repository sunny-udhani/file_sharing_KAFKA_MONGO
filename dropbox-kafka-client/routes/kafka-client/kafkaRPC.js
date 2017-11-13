var crypto = require('crypto');
var kafka = require('kafka-node');
var conn = require('./config/Connection');
var response_topics = require('../../config/topic_enum').res_topic_names;

var TIMEOUT = 8000; //time to wait for response in ms
var self = null;

exports = module.exports = KafkaRPC;

function KafkaRPC() {
    self = this;
    this.connection = conn;
    this.requests = {}; //hash to store request in wait for response
    this.response_queue = false; //placeholder for the future queue
    this.producer = this.connection.getProducer();
}

KafkaRPC.prototype.makeRequest = function (topic_name, response_topic, content, callback) {

    self = this;
    //generate a unique correlation id for this call
    var correlationId = crypto.randomBytes(16).toString('hex');

    //create a timeout for what should happen if we don't get a response
    var tId = setTimeout(function (corr_id) {
        //if this ever gets called we didn't get a response in a
        //timely fashion
        console.log('timeout');
        callback(new Error("timeout " + corr_id));
        //delete the entry from hash
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    //create a request entry to store in a hash
    var entry = {
        callback: callback,
        timeout: tId //the id for the timeout so we can clear it
    };

    //put the entry in the hash so we can match the response later
    self.requests[correlationId] = entry;
    // var keyedMessage = kafka.KeyedMessage;
    // var message = null;
    // if (response_topic === response_topics.UPLOAD_FILES) {
    //     message = new keyedMessage('aaj', content);
    // }

    //make sure we have a response topic
    self.setupResponseQueue(response_topic, function () {

        //put the request on a topic

        // console.log("key message");
        // console.log(message);

        // var payloads = [];

        // if (message) {
        //     payloads = [
        //         {
        //             topic: topic_name,
        //             messages: [JSON.stringify({
        //                 correlationId: correlationId,
        //                 replyTo: response_topic,
        //                 data: 'file'
        //             }), message],
        //             partition: 0
        //         }
        //     ];
        // } else {

        var payloads = [
                {
                    topic: topic_name,
                    messages: JSON.stringify({
                        correlationId: correlationId,
                        replyTo: response_topic,
                        data: content
                    }),
                    partition: 0
                }
            ];
        // }

        console.log("is producer ready: " + self.producer.ready);
        self.producer.send(payloads, function (err, data) {
            if (err) {
                console.log("in err of rpc");
                console.log(err);
            }
            console.log(data);

        });
    });
};

KafkaRPC.prototype.setupResponseQueue = function (topic_name, next) {
    //don't mess around if we have a queue
    if (this.response_queue) return next();
    self = this;

    //subscribe to messages

    var register_consumer = self.connection.getConsumer(response_topics.REGISTER);
    var login_consumer = self.connection.getConsumer(response_topics.LOGIN);
    var logout_consumer = self.connection.getConsumer(response_topics.LOGOUT);
    var setPath_consumer = self.connection.getConsumer(response_topics.SET_UPLOAD_PATH);
    var uploadFile_consumer = self.connection.getConsumer(response_topics.UPLOAD_FILES);
    var fileDetails_consumer = self.connection.getConsumer(response_topics.LIST_FILES.USER_FILES);
    var sharedFileDetails_consumer = self.connection.getConsumer(response_topics.LIST_FILES.SHARED_FILES);
    var getUserDetails_consumer = self.connection.getConsumer(response_topics.GET_USER_DETAILS);
    var insertShareDetails_consumer = self.connection.getConsumer(response_topics.INSERT_SHARE_DETAILS);
    var makeDirectory_consumer = self.connection.getConsumer(response_topics.MAKE_DIRECTORY);
    var saveDirectory_consumer = self.connection.getConsumer(response_topics.SAVE_DIRECTORY);
    var starfile_consumer = self.connection.getConsumer(response_topics.STAR_FILE);
    var createGroup_consumer = self.connection.getConsumer(response_topics.CREATE_GROUP);
    var addMembers_consumer = self.connection.getConsumer(response_topics.ADD_MEMBERS_GROUP);
    var listGroups_consumer = self.connection.getConsumer(response_topics.LIST_GROUPS);
    var listGroupFiles_consumer = self.connection.getConsumer(response_topics.LIST_GROUP_FILES);
    var groupFileUpload_consumer = self.connection.getConsumer(response_topics.GROUP_SHARE_FILE_UPLOAD);
    var listGroupMembers_consumer = self.connection.getConsumer(response_topics.LIST_GROUP_MEMBERS);

    register_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    login_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    logout_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    setPath_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    uploadFile_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    fileDetails_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    sharedFileDetails_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    getUserDetails_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    insertShareDetails_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    makeDirectory_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    saveDirectory_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    starfile_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    createGroup_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    listGroups_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    listGroupFiles_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    groupFileUpload_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    addMembers_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    listGroupMembers_consumer.on('message', function (message) {
        console.log('msg received');
        var data = JSON.parse(message.value);

        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if (correlationId in self.requests) {
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            console.log('in response');
            console.log(data.data);

            if (data.data.status === 400) {
                entry.callback(data.data.err, null);
            } else {
                entry.callback(null, data.data)
            }
        }
    });

    self.response_queue = true;
    console.log('returning next');
    return next();
};