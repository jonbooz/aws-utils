const AWS = require('./aws.js');

const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;

const resources = require('./resources.js');

const RESULT_SET = {
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

const EXPECTED = {
    'logical': 'physical',
    'LOGICAL': 'PHYSICAL'
};

beforeEach(() => {
    this.sandbox = sinon.createSandbox();
});

afterEach(() => {
    this.sandbox.restore();
});

describe('resources', () => {
    it('reads stack resources', async () => {
        const cfnDescribeStub = this.sandbox.stub(AWS, 'call');
        cfnDescribeStub.returns(new Promise((resolve, reject) => {
            resolve(RESULT_SET);
        }));

        const res = await resources('name', ['logical', 'LOGICAL']);
        expect(res).to.eql(EXPECTED);
    });
});
