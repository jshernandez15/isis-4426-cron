var AWS = require("aws-sdk");
var fs = require('fs');
const spawn = require('child_process').spawn;

var path_nas = '/Users/urregoo/Downloads/';

var SESCREDENTIALS = {
    accessKeyId: process.env.KEYID || '',
    secretAccessKey: process.env.SECRETKEYID || ''
};

exports.fileToConverted = function(fileName, fileId) {

    let s3bucket = new AWS.S3({
        accessKeyId: SESCREDENTIALS.accessKeyId,
        secretAccessKey: SESCREDENTIALS.secretAccessKey,
    });
    AWS.config.region = "us-west-2"; //us-west-2 is Oregon
    var response = {};

    var params = { Bucket: '4426-grupo1-videos/original', Key: fileName };
    var file = require('fs').createWriteStream('/Users/urregoo/Downloads/' + fileName).once('finish', function() {
        converterVideo(file.path, fileId).then(() => {

            console.log(path_nas + fileId + ".mp4");
            fs.readFile(path_nas + fileId + ".mp4", function(err, data) {
                if (err) { throw err; }
                params = { Bucket: "4426-grupo1-videos/convertido", Key: fileId + ".mp4", Body: data };
                s3bucket.upload(params, function(err, data) {
                    if (err) {
                        console.log('error in callback');
                    }
                    console.log('success');
                });
            });

        });
    });
    s3bucket.getObject(params).createReadStream().pipe(file);
    console.log(file.path)


};

function converterVideo(pathReal, id) {
    const p = new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-i', `${pathReal}`, '-codec:a', 'libfdk_aac', '-codec:v', 'libx264', '-profile:v', 'main', `${path_nas}${id}.mp4`]);
        ffmpeg.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        ffmpeg.on('close', (code) => {
            resolve();
        });
    });
    return p;
}