const {nlp} = require('../nlp.js');
const {trainClassifierFromCsvData} = require('./trainClassifier.js')

module.exports.trainFromCsv = async event => {

  event.Records.forEach((record) => {
    const bucketname = record.s3.object.bucket;
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;
    console.log(`New .csv object has been created: ${filename} (${filesize} bytes)`);



  });

  const requestBody = JSON.parse(event.body)

  const analyzedText = nlp(requestBody)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        request: requestBody,
        stemmed_word_count: analyzedText
      },
      null,
      2
    ),
  };
};

// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm')
            .subClass({ imageMagick: true }); // Enable ImageMagick integration.
var util = require('util');

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = function(event, context, callback) {
    // Read options from the event.
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    var dstBucket = srcBucket + "resized";
    var dstKey    = "resized-" + srcKey;

    // Download the image from S3, transform, and upload to a different S3 bucket.
    async.waterfall([
        function download(next) {
            // Download the image from S3 into a buffer.
            s3.getObject({
                    Bucket: srcBucket,
                    Key: srcKey
                },
                next);
            },
        function transform(response, next) {

            csvStream()
            gm(response.Body).size(function(err, size) {
                // Infer the scaling factor to avoid stretching the image unnaturally.
                var scalingFactor = Math.min(
                    MAX_WIDTH / size.width,
                    MAX_HEIGHT / size.height
                );
                var width  = scalingFactor * size.width;
                var height = scalingFactor * size.height;

                // Transform the image buffer in memory.
                this.resize(width, height)
                    .toBuffer(imageType, function(err, buffer) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, response.ContentType, buffer);
                        }
                    });
            });
        },
        function upload(contentType, data, next) {
            // Stream the transformed image to a different S3 bucket.
            s3.putObject({
                    Bucket: dstBucket,
                    Key: dstKey,
                    Body: data,
                    ContentType: contentType
                },
                next);
            }
        ], function (err) {
            if (err) {
                console.error(
                    'Unable to resize ' + srcBucket + '/' + srcKey +
                    ' and upload to ' + dstBucket + '/' + dstKey +
                    ' due to an error: ' + err
                );
            } else {
                console.log(
                    'Successfully resized ' + srcBucket + '/' + srcKey +
                    ' and uploaded to ' + dstBucket + '/' + dstKey
                );
            }

            callback(null, "message");
        }
    );
};