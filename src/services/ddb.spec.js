const aws = require('../awsUtils.js');

const sinon = require('sinon');
const expect = require('chai').expect;

const ddb = require('./ddb.js');

beforeEach(() => {
    this.sandbox = sinon.createSandbox();
});

afterEach(() => {
    this.sandbox.restore();
});

const TABLE = 'table';

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

describe('ddb', () => {
    it('writes to DynamoDB', async () => {
        const expectedParams = {
            Item: DYNAMO_OBJECT,
            TableName: TABLE
        };

        const awsMock = this.sandbox.mock(aws);
        const putItemMock = awsMock.expects('call');
        putItemMock.withArgs('DynamoDB', 'putItem', expectedParams)
                .once()
                .returns(new Promise((resolve, reject) => {
                    resolve({});
                }))
        
        const res = await ddb._save(aws, TABLE, JSON_OBJECT);
        expect(res).to.eql({});

        awsMock.verify();
    });

    it('reads from DynamoDB', async () => {
        const key = { name: 'name' };
        const expectedParams = {
            Key: { name: { S: 'name' }},
            TableName: TABLE
        }
        const getItemStub = this.sandbox.stub(aws, 'call');
        getItemStub.withArgs('DynamoDB', 'getItem', expectedParams)
                .returns(new Promise((resolve, reject) => {
                    resolve({ Item: DYNAMO_OBJECT });
                }));

        const res = await ddb._read(aws, TABLE, key);
        expect(res).to.eql(JSON_OBJECT);
    });

    it('scans from DynamoDB - no names', async () => {
        const expression = 'name = :v1';
        const value = {'v1': 'name'};
        const expectedParams = {
            TableName: TABLE,
            FilterExpression: expression,
            ExpressionAttributeValues: {'v1': {S: 'name'}}
        };
        
        const scanStub = this.sandbox.stub(aws, 'call');
        scanStub.withArgs('DynamoDB', 'scan', expectedParams)
                .returns(new Promise((resolve, reject) => {
                    resolve({ Items: [DYNAMO_OBJECT, DYNAMO_OBJECT]});
                }));

        const res = await ddb._scan(aws, TABLE, expression, value);
        expect(res).to.eql([JSON_OBJECT, JSON_OBJECT]);
    });

    it('scans from DynamoDB - with names', async () => {
        const expression = '#n = :v1';
        const value = {'v1': 'name'};
        const names = {'#n': 'name'}
        const expectedParams = {
            TableName: TABLE,
            FilterExpression: expression,
            ExpressionAttributeValues: {'v1': {S: 'name'}},
            ExpressionAttributeNames: names
        };
        
        const scanStub = this.sandbox.stub(aws, 'call');
        scanStub.withArgs('DynamoDB', 'scan', expectedParams)
                .returns(new Promise((resolve, reject) => {
                    resolve({ Items: [DYNAMO_OBJECT, DYNAMO_OBJECT]});
                }));

        const res = await ddb._scan(aws, TABLE, expression, value, names);
        expect(res).to.eql([JSON_OBJECT, JSON_OBJECT]);
    });

    it('scans all from DynamoDB', async () => {
        const expectedParams = {
            TableName: TABLE,
        };
        
        const scanStub = this.sandbox.stub(aws, 'call');
        scanStub.withArgs('DynamoDB', 'scan', expectedParams)
                .returns(new Promise((resolve, reject) => {
                    resolve({ Items: [DYNAMO_OBJECT, DYNAMO_OBJECT]});
                }));

        const res = await ddb._scanAll(aws, TABLE);
        expect(res).to.eql([JSON_OBJECT, JSON_OBJECT]);

    });

});

