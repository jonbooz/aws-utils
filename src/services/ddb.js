'use strict';

const AWS = require('aws-sdk');

module.exports = {

    /**
     * @param {AwsUtils} aws
     */
    _register: function(aws) {
        aws.ddb = this;
        aws.ddb.save = (table, object) => this._save(aws, table, object);
        aws.ddb.read = (table, key) => this._read(aws, table, key);
        aws.ddb.scan = (table, expression, values, names) => this._scan(aws, table, expression, values, names);
    },

    /**
     * Save the given JSON object to DynamoDB.
     * 
     * This method will convert the object into an appropriate
     * DynamoDB object, making assumptions about the DDB types
     * based on the type of the JSON data.
     * 
     * This conversion will hold to the contract:
     * 
     * `x == read(save(x))`
     * 
     * and:
     * 
     * `y == save(read(y))`
     * 
     * where `x` is the JSON object and `y` is the DDB object.
     * 
     * @param {AwsUtils} aws 
     * @param {string} table 
     * @param {object} object 
     */
    _save: function(aws, table, object) {
        const params = {
            Item: toDynamoDBObject(object),
            TableName: table
        };
        return new Promise((resolve, reject) => {
            aws.call('DynamoDB', 'putItem', params)
                .then(resolve)
                .catch(reject);
        });
    },

    /**
     * Reads the value for the `key` from DynamoDB.
     * 
     * This method will convert the object into an appropriate
     * JSON object, using the typing information from the DDB
     * object.
     * 
     * This conversion will hold to the contract:
     * 
     * `x == read(save(x))`
     * 
     * and:
     * 
     * `y == save(read(y))`
     * 
     * where `x` is the JSON object and `y` is the DDB object.
 
     * @param {AwsUtils} aws 
     * @param {string} table 
     * @param {_.Dictionary<any>} key 
     */
    _read: function(aws, table, key) {
        const params = {
            Key: toDynamoDBObject(key),
            TableName: table
        };
        return new Promise((resolve, reject) => {
            aws.call('DynamoDB', 'getItem', params)
                .then(data => fromDynamoDBObject(data.Item))
                .then(resolve)
                .catch(reject);
        });
    },

    /**
     * 
     * @param {AwsUtils} aws
     * @param {string} table
     * @param {string} expression
     * @param {_.Dictionary<any>} values
     */
    _scan: function(aws, table, expression, values, names) {
        const params = {
            TableName: table,
            FilterExpression: expression,
            ExpressionAttributeValues: toDynamoDBObject(values)
        };
        if (typeof names !== 'undefined') {
            params.ExpressionAttributeNames = names
        }

        return new Promise((resolve, reject) => {
            aws.call('DynamoDB', 'scan', params)
                .then(data => data.Items)
                .then(items => items.map((i) => fromDynamoDBObject(i)))
                .then(resolve)
                .catch(reject);
        });
    }
}

const fromDynamoDBObject = function(ddbObject) {
    return AWS.DynamoDB.Converter.unmarshall(ddbObject);
};

const toDynamoDBObject = function(object) {
    return AWS.DynamoDB.Converter.marshall(object);
};
