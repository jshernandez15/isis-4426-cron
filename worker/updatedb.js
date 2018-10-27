"use strict";

var AWS = require("aws-sdk");

exports.update = function(id, path_convertido, callback) {

    AWS.config.update({
        accessKeyId: process.env.KEYID,
        secretAccessKey: process.env.SECRETKEYID
    });
    AWS.config.region = "us-west-2"; //us-west-2 is Oregon

    var ddb = new AWS.DynamoDB();

    var params = {
        TableName: 'videos',
        Key: {
            id: id
        },
        UpdateExpression: "set path_convertido = :path_convertido, state_video = :state_video",
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":path_convertido": path_convertido,
            ":state_video": "Generado",
            ":id": id
        },
        ReturnValues: "UPDATED_NEW"
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