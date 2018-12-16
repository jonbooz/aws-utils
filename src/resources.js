'use strict';

var AWS = require('./aws.js');
const FastSet = require('collections/fast-set');

module.exports = function(stackName, namedResources, otherAWS) {
    if (typeof otherAWS !== 'undefined') {
        AWS = otherAWS;
    }

    const cloudformation = new AWS.CloudFormation();

    var params = {
        StackName: stackName
    };

    return new Promise((resolve, reject) => {
        cloudformation.describeStackResources(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const resources = processResources(data, namedResources);
                resolve(resources);
            }
        });
    });
}

const processResources = function (data, namedResources) {
    const resourceIds = new FastSet(namedResources);
    var resources = { };
    for (let i in data.StackResources) {
        const r = data.StackResources[i];
        if (resourceIds.has(r.LogicalResourceId)) {
            resources[r.LogicalResourceId] = r.PhysicalResourceId;
        }
    }
    return resources;
}
