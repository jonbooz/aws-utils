'use strict';

const AWS = require('./aws.js');
const DynamoDB = new AWS.DynamoDB();

module.exports = {
    save: function(table, object) {
        var params = {
            Item: toDynamoDBObject(object),
            TableName: table
        };
        return new Promise((resolve, reject) => {
            AWS.call(DynamoDB, 'putItem', params)
                .then(resolve)
                .catch(reject);
        });
    },

    read: function(table, key) {
        var params = {
            Key: toDynamoDBObject(key),
            TableName: table
        };
        return new Promise((resolve, reject) => {
            AWS.call(DynamoDB, 'getItem', params)
                .then(data => fromDynamoDBObject(data.Item))
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
