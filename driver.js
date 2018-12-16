#!/usr/bin/env node

'use strict';

const awsUtils = require('./src/index.js');

const namedResources = [
    'credentialsKeyAlias',
    'credentialsTable'
];

awsUtils.resources('credentials', namedResources)
    .then(resources => console.log(resources))
    .catch(error => console.log(error));

async function getResources() {
    let resources = await awsUtils.resources('credentials', namedResources);
    var object = {
        name: 'test',
        value: 'value'
    }
    let saveResponse = await awsUtils.ddb.save(resources.credentialsTable, object);
    let value = await awsUtils.ddb.read(resources.credentialsTable, {name: 'test'});
    console.log(value);
}


getResources();

