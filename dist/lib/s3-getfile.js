"use strict";
// went to node native nodejs promises
//Promise = require("bluebird");
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
//AWS.config.setPromisesDependency(Promise); // AWS will use bluebird promises since we overwrote global Promise var above with bluebird
var s3 = new AWS.S3({ region: 'us-west-2',
});
// TODO: handle multiple records
// exports.getFiles = function(awsEventRecords) {
//     // call getFile for each object in Records array
// }
// takes an S3 event (http://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html)
// describing a file; returns a promise that will return the file content as its data
function getFilePromise(event) {
    console.log("in s3-getfile");
    //console.log(JSON.stringify(event))
    var notification = event.s3; //event.Records[0].s3;
    var notificationKey = notification.object.key;
    // TODO: handle SES notifications in addition to S3
    //var sesNotification = event.Records[0].ses;
    // console.log("SES Notification:\n", JSON.stringify(sesNotification, null,
    // 2));
    console.log('notificationKey: ', notificationKey, '   Bucket: ', notification.bucket.name);
    // Retrieve the email from its bucket
    return s3
        .getObject({ Bucket: notification.bucket.name, Key: notificationKey })
        .promise()
        .then(function (fileObject) {
        return fileObject;
    })
        .then(function (value) {
        console.log('All is well!', value);
        return value.Body.toString();
    })
        .catch(function (error) {
        // Handle any error from all above steps
        console.log('getFilePromise error: ', error);
        return error;
    });
}
exports.getFilePromise = getFilePromise;
function putObject(item, key) {
    var params = {
        Body: JSON.stringify(item),
        Bucket: "datalake-2019",
        Key: key,
    };
    s3.putObject(params, function (err, data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else {
            console.log("s3 upload success");
        } // successful response
        /*
        data = {
         ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
         VersionId: "psM2sYY4.o1501dSx8wMvnkOzSBB.V4a"
        }
        */
    });
}
exports.putObject = putObject;
//# sourceMappingURL=s3-getfile.js.map