const AWS = require('aws-sdk');
const _ = require('lodash');

const ddb = require('./services/ddb.js');

const DEFAULT_PROFILE = 'default';
const DEFAULT_REGION = 'us-west-2';

/**
 * A wrapper class for easily working with AWS services.
 */
module.exports = class AwsUtils {
    /**
     *
     * @param {string?} profile : The AWS credentials file profile to use.
     * @param {string?} region : the AWS region to use
     */
    constructor(profile, region) {
        if (typeof profile === 'undefined') {
            profile = DEFAULT_PROFILE;
        }
        if (typeof region === 'undefined') {
            region = DEFAULT_REGION;
        }

        const credentials = new AWS.SharedIniFileCredentials({profile: profile});
        AWS.config.update({
            region: region,
            credentials: credentials,
            apiVersions: {
                cloudformation: '2010-05-15',
                dynamodb: '2012-08-10',
                kms: '2014-11-01'
            }
        });

        this.aws = AWS;
        ddb._register(this);
    }

    /**
     * Instantiate a new AWS service client with the given name.
     * 
     * This client will be cached in this class so it will not need to be
     * recreated on each use.
     * 
     * If you are calling `call` you do not need call this method, as `call`
     * includes it for you.
     * 
     * @param {string} serviceName - The AWS service to use.
     */
    useService(serviceName) {
        if (!this.hasOwnProperty(serviceName)) {
            this[serviceName] = new AWS[serviceName]();
        }
    }

    /**
     * Make a call to the given `method` of the AWS `serviceName`, with the
     * given `params` object.
     * 
     * This returns a `Promise` object that will either resolves with the
     * response of the service call or reject with the error message.
     * 
     * @param {string} serviceName - The AWS service to use.
     * @param {string} method - The method to call.
     * @param {object} params - The parameters for the method.
     */
    call(serviceName, method, params) {
        this.useService(serviceName);
        return new Promise((resolve, reject) => {
            this[serviceName][method](params, (err, data) => {
               if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Lists the stack resources for the given CloudFormation `stackName`.
     * 
     * This returns the resources in the form of `LogicalResourceId` to `PhysicalResourceId`.
     * 
     * @param {*} stackName 
     */
    async listStackResources(stackName) {
        return this.call('CloudFormation', 'describeStackResources', {StackName: stackName})
            .then(data => data.StackResources)
            .then(stackResources => stackResources.map((r) => [r.LogicalResourceId, r.PhysicalResourceId]))
            .then(stackResources => _.fromPairs(stackResources));
    }

}
