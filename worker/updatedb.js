"use strict";

var AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.KEYID,
    secretAccessKey: process.env.SECRETKEYID
});
AWS.config.region = "us-west-2"; //us-west-2 is Oregon

exports.update = function(id, path_convertido, callback) {

    var ddb = new AWS.DynamoDB.DocumentClient;

    var params = {
        TableName: 'videos',
        Key: {
            "id": id
        },
        UpdateExpression: "set path_convertido = :path_convertido, state_video = :state_video",
        ExpressionAttributeValues: {
            ":path_convertido": path_convertido,
            ":state_video": "Generado"
        },
        ReturnValues: "UPDATED_NEW"
    };

    ddb.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            callback({ code: 500 });
        } else {
            console.log("Success", data);
            callback({ code: 200 });
        }
    });
};

exports.select = function(fkid, callback) {

    var ddb = new AWS.DynamoDB();

    var params = {
        TableName: 'competitions',

        Key: {
            "id": {
                "S": fkid
            }
        },
        ProjectionExpression: 'address'
    };

    ddb.getItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            callback({ code: 500 });
        } else {
            console.log("Success", data.Item);
            callback(data.Item);
        }
    });
};