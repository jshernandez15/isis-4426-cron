"use strict";

var AWS = require("aws-sdk");

exports.update = function(competition, id, callback) {

    AWS.config.update({
        accessKeyId: process.env.KEYID,
        secretAccessKey: process.env.SECRETKEYID
    });
    AWS.config.region = "us-west-2"; //us-west-2 is Oregon

    var ddb = new AWS.DynamoDB();

    var params = {
        TableName: 'videos',
        Item: {
            "path_convertido": { "S": video.pathConvertido },
            "state_video": { "S": video.stateVideo }
        }
    };

    ddb.putItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            callback({ code: 500 });
        } else {
            console.log("Success", data);
            callback({ code: 200 });
        }
    });
};