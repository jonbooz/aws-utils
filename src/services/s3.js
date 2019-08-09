'use strict';

module.exports = {

    /**
     * @param {AwsUtils} aws 
     */
    _register: function(aws) {
        aws.s3 = this;
        aws.s3.getObject = (bucket, key) => this._getObject(aws, bucket, key);
    },

    /**
     * Gets the specified object from an S3 bucket.
     * 
     * @param {AwsUtils} aws 
     * @param {string} bucket 
     * @param {string} item 
     */
    _getObject: function(aws, bucket, key) {
        var params = {
            Bucket: bucket,
            Key: key
        };
        return new Promise((resolve, reject) => {
            aws.call('S3', 'getObject', params)
                .then(data => data.Body)
                .then(resolve)
                .catch(reject);
        });
    }
}