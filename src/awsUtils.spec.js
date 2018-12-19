const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const AwsUtils = require('./awsUtils.js');

const TEST_SERVICE_NAME = 'TestService';
const TEST_SERVICE_METHODS = {
    successMethod: function(param, callback) {
        callback(null, param);
    },
    errorMethod: function(param, callback) {
        callback(param, null);
    }
};

const STACK_RESOURCE_RESULT = {
    StackResources: [
        {
            LogicalResourceId: 'logical',
            PhysicalResourceId: 'physical'
        }, 
        {
            LogicalResourceId: 'LOGICAL',
            PhysicalResourceId: 'PHYSICAL'
        }
    ]
};
const EXPECTED_STACK_RESOURCES = {
    'logical': 'physical',
    'LOGICAL': 'PHYSICAL'
};


beforeEach(() => {
    this.sandbox = sinon.createSandbox();
    this.aws = new AwsUtils();
});

afterEach(() => {
    this.sandbox.restore();
});

describe('AwsUtils', () => {
    it('instantiates an AWS service', () => {
        this.aws.useService('DynamoDB');
        expect(this.aws.DynamoDB.serviceIdentifier).to.equal('dynamodb');
    });

    it('calls an API method - successfully', async () => {
        this.aws[TEST_SERVICE_NAME] = TEST_SERVICE_METHODS;
        var expected = 'param';
        let result = await this.aws.call(TEST_SERVICE_NAME, 'successMethod', expected);
        expect(result).to.eql(expected);
    });

    it('calls an API method - with an error', async () => {
        this.aws[TEST_SERVICE_NAME] = TEST_SERVICE_METHODS;
        var expected = 'param';
        await this.aws.call(TEST_SERVICE_NAME, 'errorMethod', expected)
            .catch(err => expect(err).to.equal(expected));
    });

    it('reads stack resources - success', async () => {
        const cfnDescribeStub = this.sandbox.stub(this.aws, 'call');
        cfnDescribeStub.returns(new Promise((resolve, reject) => {
            resolve(STACK_RESOURCE_RESULT);
        }));

        const res = await this.aws.listStackResources('name', ['logical', 'LOGICAL']);
        expect(res).to.eql(EXPECTED_STACK_RESOURCES);

    });

    it('reads stack resources - error', async () => {
        const expectedError = 'error';
        const cfnDescribeStub = this.sandbox.stub(this.aws, 'call');
        cfnDescribeStub.returns(new Promise((resolve, reject) => {
            reject(expectedError);
        }));

        await this.aws.listStackResources('name', ['logical', 'LOGICAL'])
                .catch(err => expect(err).to.equal(expectedError));
    });


});
