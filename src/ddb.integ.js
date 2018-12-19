const AwsUtils = require('./awsUtils.js');
const datetime = require('node-datetime');

const chai = require('chai');
const expect = chai.expect;

const STACK_NAME = 'credentials';

describe('ddb', () => {
    it('writes and reads from DynamoDB', async () => {
        const aws = new AwsUtils()
        const resources = await aws.listStackResources(STACK_NAME);
        var object = {
            name: 'test',
            value: datetime.create().format('Y-m-d H:I:S'),
            bool: true,
            otherBool: false,
            number: 3.14
        }
        await aws.ddb.save(aws, resources.credentialsTable, object);
        let res = await aws.ddb.read(aws, resources.credentialsTable, {name: 'test'});
        expect(res).to.eql(object);
    });
});
