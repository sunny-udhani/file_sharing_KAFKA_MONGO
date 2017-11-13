var rpc = new (require('./kafkaRPC'))();

//make request to kafka
function make_request(topic_name, response_topic, msg_payload, callback) {
    rpc.makeRequest(topic_name, response_topic, msg_payload, function (err, response) {
        console.log("after response data received");

        if (err) {
            console.error('error : invalid action');
            console.error(err);
            callback(err, null);
        }
        else {
            console.log("in kafka client on successful response");
            callback(null, response);
        }
    });
}

exports.make_request = make_request;
