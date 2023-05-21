const AwsUtils = require('../awsUtils.js');
const datetime = require('node-datetime');

const chai = require('chai');
const expect = chai.expect;

const STACK_NAME = 'credentials';

describe('ddb', () => {
    it('writes and reads from DynamoDB', async () => {
        const aws = new AwsUtils();
        const resources = await aws.listStackResources(STACK_NAME);
        const object = {
            name: 'test',
            value: datetime.create().format('Y-m-d H:I:S'),
            bool: true,
            otherBool: false,
            number: 3.14,
            array: ['name', datetime.create().format('Y-m-d'), true, 3.14]
        };
        const expression = 'begins_with(#n, :v1)';
        const values = { ':v1': 'test' };
        const names = { '#n': 'name'};
        await aws.ddb.save(resources.credentialsTable, object);
        let res = await aws.ddb.read(resources.credentialsTable, {name: 'test'});
        expect(res).to.eql(object);

        let scanRes = await aws.ddb.scan(resources.credentialsTable, expression, values, names);
        expect(scanRes).to.eql([object]);

        let scanAllRes = await aws.ddb.scanAll(resources.credentialsTable);
        let testObject = scanAllRes.filter(obj => obj.name == 'test');
        expect(testObject).to.eql([object]);
    });

});
