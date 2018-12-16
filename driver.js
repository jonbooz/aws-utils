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
    console.log(resources);
}

getResources();

