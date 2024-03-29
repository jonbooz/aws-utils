const AWS = require('aws-sdk');
const _ = require('lodash');

const ddb = require('./services/ddb.js');
const s3 = require('./services/s3.js');
const ses = require('./services/ses.js');

const DEFAULT_PROFILE = 'default';
const DEFAULT_REGION = 'us-west-2';

/**
 * A wrapper class for easily working with AWS services.
 *
 * @type {AwsUtils}
 */
module.exports = class AwsUtils {
    /**
     *
     * @param {boolean?} provideCredentials : Whether to provide credentials.
     * @param {string?} region : the AWS region to use
     * @param {string?} profile : The AWS credentials file profile to use.
     */
    constructor(provideCredentials, region, profile) {
        if (typeof region === 'undefined') {
            region = DEFAULT_REGION;
        }

        const configParams = {
            region: region,
            apiVersions: {
                cloudformation: '2010-05-15',
                dynamodb: '2012-08-10',
                kms: '2014-11-01',
                ses: '2010-12-01',
                s3: '2006-03-01'
            }
        }

        if (provideCredentials) {
            if (typeof profile === 'undefined') {
                profile = DEFAULT_PROFILE;
            }
            const credentials = new AWS.SharedIniFileCredentials({profile: profile});
            configParams.credentials = credentials;
        }

        AWS.config.update(configParams);

        this._resources = { };

        this.aws = AWS;
        ddb._register(this);
        ses._register(this);
        s3._register(this);
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
     * @param {any} params - The parameters for the method.
     * @return {Promise<any>}
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
     * @param {string} stackName
     * @return {_.Dictionary<string>}
     */
    async listStackResources(stackName) {
        if (this._resources.hasOwnProperty(stackName)) {
            return this._resources[stackName];
        }

        return this.call('CloudFormation', 'describeStackResources', {StackName: stackName})
            .then(data => data.StackResources)
            .then(stackResources => stackResources.map((r) => [r.LogicalResourceId, r.PhysicalResourceId]))
            .then(stackResources => {
                const resources = _.fromPairs(stackResources);
                this._resources[stackName] = resources;
                return resources;
            });
    }

}
