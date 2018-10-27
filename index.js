const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');
var SConfig = require("./worker/sConfig");

var SESCREDENTIALS = {
    accessKeyId: process.env.KEYID || '',
    secretAccessKey: process.env.SECRETKEYID || ''
};

AWS.config.update({
    region: 'us-west-2',
    accessKeyId: SESCREDENTIALS.accessKeyId,
    secretAccessKey: SESCREDENTIALS.secretAccessKey
});

const app = Consumer.create({
    queueUrl: 'https://sqs.us-west-2.amazonaws.com/994147617895/sqsGrupo1',
    handleMessage: (message, done) => {
        responseJson = JSON.parse(message.Body);
        console.log(responseJson.path)
        SConfig.fileToConverted(responseJson.path, responseJson.id)

        done();
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.log(err.message);
});
app.start();