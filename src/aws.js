const AWS = require('aws-sdk');
const AWS_REGION = 'us-west-2';

const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

AWS.config.update({
    region: AWS_REGION,
    credentials: credentials,
    apiVersions: {
        cloudformation: '2010-05-15',
        dynamodb: '2012-08-10',
        kms: '2014-11-01'
    }
});

AWS['call'] = function(service, api, params) {
    return new Promise((resolve, reject) => {
        service[api](params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = AWS;
