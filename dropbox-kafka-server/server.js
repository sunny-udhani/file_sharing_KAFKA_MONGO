var connection = require('./config/kafkaConnection');
var topics = require('./config/enum').topic_names;
var FormData = require('form-data');

require('./config/db');

var login = require('./services/login');
var register = require('./services/register');
var logout = require('./services/logout');
var upload = require('./services/upload');
var fileDetails = require('./services/fileDetails');
var share = require('./services/share');
var directory = require('./services/directory');
var starInd = require('./services/starInd');
var groups = require('./services/groupshare');

var register_consumer = connection.getConsumer(topics.REGISTER);
var login_consumer = connection.getConsumer(topics.LOGIN);
var logout_consumer = connection.getConsumer(topics.LOGOUT);
var upload_consumer = connection.getConsumer(topics.UPLOAD_FILES);
var setUploadPath_consumer = connection.getConsumer(topics.SET_UPLOAD_PATH);
var listUserFiles_consumer = connection.getConsumer(topics.LIST_FILES.USER_FILES);
var insertSharedFiles_consumer = connection.getConsumer(topics.INSERT_SHARE_DETAILS);
var userDetails_consumer = connection.getConsumer(topics.GET_USER_DETAILS);
var listUserSharedFiles_consumer = connection.getConsumer(topics.LIST_FILES.SHARED_FILES);
var makeDirectory_consumer = connection.getConsumer(topics.MAKE_DIRECTORY);
var saveDirectory_consumer = connection.getConsumer(topics.SAVE_DIRECTORY);
var starInd_consumer = connection.getConsumer(topics.STAR_FILE);
var createGroup_consumer = connection.getConsumer(topics.CREATE_GROUP);
var addGroupMember_consumer = connection.getConsumer(topics.ADD_MEMBERS_GROUP);
var listGroups_consumer = connection.getConsumer(topics.LIST_GROUPS);
var listGroupFiles_consumer = connection.getConsumer(topics.LIST_GROUP_FILES);
var groupFileUpload_consumer = connection.getConsumer(topics.GROUP_SHARE_FILE_UPLOAD);
var listGroupMembers_consumer = connection.getConsumer(topics.LIST_GROUPS_MEMBERS);


var producer = connection.getProducer();

console.log('server is running');

register_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    register.register(data.data, function (err, res) {
        console.log('after handle : ' + res + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        console.log('reply to:  ' + data.replyTo);
        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        console.log(producer.ready);

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

login_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);
    console.log(data.data);
    login.validateLogin(data.data, function (err, res) {
        console.log('after handle : ' + res + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

upload_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    // console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    // console.log(data);

    upload.fileUpload(data.data, function (err, res) {
        console.log('after handle : ' + res + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

setUploadPath_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);
    console.log(data);
    upload.setUploadPath(data.data, function (err, res) {
        console.log('after handle : ' + res + " -- " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

listUserFiles_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    var data = JSON.parse(message.value);
    console.log(data);
    fileDetails.getFileList(data.data, function (err, res) {
        console.log('after handle : ' + res + " -- " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null;
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res;
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

listUserSharedFiles_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    var data = JSON.parse(message.value);
    console.log(data);
    fileDetails.getSharedFileList(data.data, function (err, res) {
        console.log('after handle : ' + res + " -- " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null;
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res;
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

logout_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    logout.handleLogout(data.data, function (err, res) {
        console.log('after handle : ' + res + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

userDetails_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    login.getUserDetails(data.data, function (err, res) {
        console.log('after handle : ' + res + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

insertSharedFiles_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    share.insertShareDetails(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

makeDirectory_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    directory.makeDirectory(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

saveDirectory_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    directory.saveDirectory(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

starInd_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    starInd.star(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

createGroup_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    groups.createGroup(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

listGroups_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    groups.listUserGroups(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

listGroupFiles_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    groups.listGroupFiles(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

groupFileUpload_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    groups.groupShareFileUpload(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

addGroupMember_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    groups.addMembersToGroup(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});

listGroupMembers_consumer.on('message', function (message) {
    console.log('message received');
    console.log(message.topic);

    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);

    groups.listGroupMembers(data.data, function (err, res) {
        console.log('after handle : ' + res + "err: " + err);

        var response_message = {};

        if (err) {
            response_message.status = 400;
            response_message.err = err;
            response_message.data = null
        } else if(res === null && err === null){
            response_message.status = 400;
            response_message.err = null;
            response_message.data = null
        }else {
            response_message.status = 200;
            response_message.err = null;
            response_message.data = res
        }

        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: response_message
                }),
                partition: 0
            }
        ];

        producer.send(payloads, function (err, data) {
            console.log("in server js -- data");
            console.log(data);

            if (err) {
                console.log(err);
            } else {
                console.log("message successfully sent by producer");
            }
        });

        return;

    });
});


makeDirectory_consumer.on('offsetOutOfRange', function (err) {
    console.log(err);
    makeDirectory_consumer.setOffset(topics.MAKE_DIRECTORY, 0, 0)

});

makeDirectory_consumer.on('error', function (err) {
    console.log(err)
});
