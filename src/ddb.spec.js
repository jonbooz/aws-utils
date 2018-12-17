const AWS = require('./aws.js');

const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;

const ddb = require('./ddb.js');

beforeEach(() => {
    this.sandbox = sinon.createSandbox();
});

afterEach(() => {
    this.sandbox.restore();
});

const DYNAMO_OBJECT = {
    name: { S: 'name' },
    number: { N: '3.1459' },
    bool: { BOOL: true }
};
const JSON_OBJECT = {
    name: 'name',
    number: Number('3.1459'),
    bool: true,
};
const PUT_ITEM_PARAMS = {
    Item: DYNAMO_OBJECT,
    TableName: 'table'
};

describe('ddb', () => {
    it('reads from DynamoDB', async () => {
        const getItemStub = this.sandbox.stub(AWS, 'call');
        getItemStub.returns(new Promise((resolve, reject) => {
            resolve({ Item: DYNAMO_OBJECT });
        }));

        const res = await ddb.read('table', { name: 'name' });
        expect(res).to.eql(JSON_OBJECT);
    });
});