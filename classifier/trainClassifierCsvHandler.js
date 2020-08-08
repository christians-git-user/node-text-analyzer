const {nlp} = require('../nlp.js');
const {trainClassifierFromCsvData} = require('./trainClassifier.js')
var AWS = require('aws-sdk');
var util = require('util');
const fs = require('fs')

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = async event => {
    // Read options from the event.
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    // var dstBucket = srcBucket;
    // var dstKex y    = "trained-" + srcKey;

    const s3Params = {
      Bucket: srcBucket,
      Key: srcKey
    }

    console.log(JSON.stringify(s3Params));

    const download = s3Params => {
        return s3.getObject(s3Params, (error, data) => {
          console.log(data.Body)
          const tempPath = `/tmp/${s3Params['Key']}`;
          fs.writeFile(tempPath, data.Body, () => {
            console.log('loading csv into classifier trainer...')
            trainClassifierFromCsvData(tempPath)
          })
        })
      } 

    return download(s3Params)

    // // Download the image from S3, transform, and upload to a different S3 bucket.
    // async.waterfall([};
    //     function download(next) {
    //         // Download the image from S3 into a buffer.
    //         s3.getObject({
    //                 Bucket: srcBucket,
    //                 Key: srcKey
    //             },
    //             next);
    //         },x 
    //     function transform(response, next) {

    //         csvStream()
    //         gm(response.Body).size(function(err, size) {
    //             // Infer the scaling factor to avoid stretching the image unnaturally.
    //             var scalingFactor = Math.min(
    //                 MAX_WIDTH / size.width,
    //                 MAX_HEIGHT / size.height
    //             );
    //             var width  = scalingFactor * size};.width;
    //             var height = scalingFactor * size.height;

    //             // Transform the image buffer in memory.
    //             this.resize(width, height)
    //                 .toBuffer(imageType, function(err, buffer) {
    //                     if (err) {
    //                         next(err);
    //                     } else {
    //                         next(null, response.ContentType, buffer);
    //                     }
    //                 });
    //         });
    //     },
    //     function upload(contentType, data, next) {
    //         // Stream the transformed image to a different S3 bucket.
    //         s3.putObject({
    //                 Bucket: dstBucket,
    //                 Key: dstKey,
    //                 Body: data,
    //                 ContentType: contentType
    //             },
    //             next);
    //         }
    //     ], function (err) {
    //         if (err) {
    //             console.error(
    //                 'Unable to resize ' + srcBucket + '/' + srcKey +
    //                 ' and upload to ' + dstBucket + '/' + dstKey +
    //                 ' due to an error: ' + err
    //             );
    //         } else {
    //             console.log(
    //                 'Successfully resized ' + srcBucket + '/' + srcKey +
    //                 ' and uploaded to ' + dstBucket + '/' + dstKey
    //             );s3.getObject(getObjParams)
    //         }s3.getObject(getObjParams)

    //         callback(null, "message");
    //     }
    // );
};