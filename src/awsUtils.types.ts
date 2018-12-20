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
        await aws.ddb.save(resources.credentialsTable, object);
        let res = await aws.ddb.read(resources.credentialsTable, {name: 'test'});
        expect(res).to.eql(object);
    });
});
