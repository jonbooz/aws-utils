const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;

const AWS = require('./aws.js');

beforeEach(() => {
    this.sandbox = sinon.createSandbox();
});

afterEach(() => {
    this.sandbox.restore();
});

describe('AWS Config', () => {
    it('calls an API method', () => {
        var service = {
            api: function(param, callback) {
                callback(null, param);
            }
        };
        var expected = 'param';
        (async () => {
            let result = AWS.call(service, 'api', expected);
            expect(result).to.eql(expected);
        });
    });
});
