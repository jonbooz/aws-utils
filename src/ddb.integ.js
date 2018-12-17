const AWS = require('./aws.js');
const datetime = require('node-datetime');

const chai = require('chai');
const expect = require('chai').expect;

const resources = require('./resources.js');
const ddb = require('./ddb.js');

const STACK_NAME = 'credentials';
const STACK_RESOURCES = [
    'credentialsKeyAlias',
    'credentialsTable'
];

describe('ddb', () => {
    it('writes and reads from DynamoDB', async () => {
        let rsrcs = await resources(STACK_NAME, STACK_RESOURCES);
        var object = {
            name: 'test',
            value: datetime.create().format('Y-m-d H:I:S')
        }
        let saveResponse = await ddb.save(rsrcs.credentialsTable, object);
        let res = await ddb.read(rsrcs.credentialsTable, {name: 'test'});
        expect(res).to.eql(object);
    });
});
