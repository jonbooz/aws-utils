'use strict';

var AWS = require('./aws.js');
const FastSet = require('collections/fast-set');

module.exports = function(stackName, namedResources) {
    var params = {
        StackName: stackName
    };

    const cloudformation = new AWS.CloudFormation();
    return new Promise((resolve, reject) => {
        AWS.call(cloudformation, 'describeStackResources', params)
            .then(data => processResources(data, namedResources))
            .then(resolve)
            .catch(reject);
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
