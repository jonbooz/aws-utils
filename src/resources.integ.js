const AWS = require('./aws.js');

const chai = require('chai');
const expect = require('chai').expect;

const resources = require('./resources.js');

const STACK_NAME = 'credentials';
const STACK_RESOURCES = [
    'credentialsKeyAlias',
    'credentialsTable'
];

const EXPECTED = {
    "credentialsKeyAlias": "alias/credentials",
    "credentialsTable": "credentials-credentialsTable-118EV0MPS27HA"
        // If the stack is ever rebuilt, this will need to change.
};

describe('resources', () => {
    it('reads stack resources', async () => {
        const res = await resources(STACK_NAME, STACK_RESOURCES);
        expect(res).to.eql(EXPECTED);
    });
});
