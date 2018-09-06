const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const path = require('path');
const spawn = require('child_process').spawn;
const parent = process.argv[2];

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'p0_user',
    password: process.env.DB_PASS || 'p455w0rd',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_SCHEMA || 'proyecto0'
});
var path_nas = "/Users/hernanjua/4426/nas/videos/";
var resultQuery = [];
app = express();

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

cron.schedule("*/30 * * * * *", function() {

    pool.getConnection(function(err, connection) {
        if (err) throw err;

        connection.query("SELECT id_video, path_real, email FROM proyecto0.videos WHERE state_video = 'En proceso' limit 1", function(error, results) {
            if (error) throw error;

            connection.release();

            if (error) throw error;

            if (results && results.length > 0) {
                results.forEach(function(video) {

                    var pathReal = video.path_real;

                    converterVideo(pathReal, video.id_video).then(() => {
                        var nueva_ruta = video.path_real.substr(video.path_real.lastIndexOf("/")+1);

                        move(video.path_real, path_nas + nueva_ruta, function(moveErr) {
                            if (moveErr) throw moveErr;

                            pool.getConnection(function(err, connection) {
                                if (err) throw err;
                                connection.query("UPDATE proyecto0.videos SET state_video = ?, path_convertido = ?, path_real=? where id_video = ?", ['Generado', '' + video.id_video + '.mp4', nueva_ruta, video.id_video], function(error, results) {
                                    if (error) throw error;
                        
                                    connection.release();
                        
                                    if (error) throw error;
    
                                    console.log(`Completed Video Id - ${video.id_video}`);
                                });
                            });
                        })
                    });

                    //sendEmail(video.email);

                });
            } else {
                console.log('There are No videos to convert.')
            }

        });
    });

});

function converterVideo(pathReal, id) {
    var fileName = pathReal.split('\\').pop().split('/').pop();
    var directoryPath = pathReal.slice(0, -(fileName.length));
    var extName = '';
    const p = new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-i', `${pathReal}`, '-codec:a', 'libfdk_aac', '-codec:v', 'libx264', '-profile:v', 'main', `${path_nas}videos_converted/${id}.mp4`]);
        ffmpeg.stderr.on('data', (data) => {
            //console.log(`${data}`);
        });
        ffmpeg.on('close', (code) => {
            resolve();
        });
    });
    return p;
}

function sendNotification(email) {

    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        secureConnection: false,
        port: 587,
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'oh.urrego@uniandes.edu.co',
            pass: '*****'
        }
    });

    var mailOptions = {
        from: '"Our Code World " <info@uniandes.edu.co>',
        to: email,
        subject: 'Hello ',
        text: 'Hello world ',
        html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
    return p;
}

app.listen(3128);