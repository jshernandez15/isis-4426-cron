const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var SConfig = require("./worker/sConfig");

var SESCREDENTIALS = {
    accessKeyId: process.env.KEYID || '',
    secretAccessKey: process.env.SECRETKEYID || ''
};

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: SESCREDENTIALS.accessKeyId,
    secretAccessKey: SESCREDENTIALS.secretAccessKey,
    region: 'us-west-2',
    rateLimit: 5
}));

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

        var mailOptions = {
            from: 'oh.urrego@uniandes.edu.co',
            to: responseJson.email,
            subject: 'Tu video ya fue cargado EXITOSAMENTE!!',
            text: 'Hola, te queremos decir que tu video ya fue procesado y cargado exitosamente'
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info);
            }
        });

        done();
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.log(err.message);
});
app.start();