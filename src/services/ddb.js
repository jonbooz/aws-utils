'use strict';

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
        var params = {
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
        var params = {
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
    var object = { };
    for (let key in ddbObject) {
        const typeToValue = ddbObject[key];
        object[key] = parseType(typeToValue);
    }
    return object;
}

const toDynamoDBObject = function(object) {
    var ddbObject = { };
    for (let key in object) {
        var value = object[key];
        const type = getType(value);
        if (type === 'N') {
            value = value+''; // N's need to be strings
        }

        ddbObject[key] = { };
        ddbObject[key][type] = value;
    }
    return ddbObject;
}

const parseType = function(typeToValue) {
    for (let type in typeToValue) {
        var value = typeToValue[type];
        if (type === 'N') {
            return Number(value);
        } else {
            return value;
        }
    }
}

const getType = function(value) {
    if (typeof value === 'number') {
        return 'N';
    } else if (typeof value === 'boolean') {
        return 'BOOL';
    } else if (typeof value === 'string') {
        return 'S';
    } else {
        return 'B'; // binary buffer, just write the data.
    }
}
