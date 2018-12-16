# Aws::Utils

A utility library for interacting with AWS.

## Including This Library

This library can be included in your node.js projects by including the following dependency:

    "aws-utils": "git+ssh://git@github.com:jonbooz/aws-utils.git"

The library can then be included into your file with:

    const awsUtils = require('aws-utils');

## Docs

Submodules:

* `AWS`: A preconfigured `require(aws-sdk)` instance.
* `resources(stack, ids, <AWS>): Promise<list,err>` : Get a list of the physical resources ids for the given `stack` corresponding to the given `resourceIds`. Can also provide an optional, customer `AWS` instance, otherwise the preconfigured one is used.
