import * as AwsUtils from './awsUtils';

import chai = require('chai');
const expect = chai.expect;

import 'mocha';

const STACK_NAME = 'credentials';

describe('Typed AwsUtils', () => {
    it('gets resources and writes/reads to DynamoDB', async () => {
        const aws = new AwsUtils()
        const resources = await aws.listStackResources(STACK_NAME);
        var object = {
            name: 'test',
            bool: true,
            otherBool: false,
            number: 3.14
        }
        const expression = 'begins_with(#n, :v1)';
        const values = { ':v1': 'test' };
        const names = { '#n': 'name'};

        await aws.ddb.save(resources.credentialsTable, object);
        let res = await aws.ddb.read(resources.credentialsTable, {name: 'test'});
        expect(res).to.eql(object);

        let scanRes = await aws.ddb.scan(resources.credentialsTable, expression, values, names);
        expect(scanRes).to.eql([object]);
    });
});
