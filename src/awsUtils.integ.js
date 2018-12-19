const chai = require('chai');
const expect = chai.expect;

const AwsUtils = require('./awsUtils.js');

const STACK_NAME = 'credentials';

const EXPECTED = {
    "credentialsKeyAlias": "alias/credentials",
    "credentialsTable": "credentials-credentialsTable-118EV0MPS27HA"
        // If the stack is ever rebuilt, this will need to change.
};

beforeEach(() => {
    this.aws = new AwsUtils();
});

describe('AwsUtils', () => {
    it ('reads stack resources', async () => {
        const res = await this.aws.listStackResources(STACK_NAME);
        expect(res).to.include(EXPECTED);
    });
})