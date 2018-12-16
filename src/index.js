'use strict';

const AWS = require('./aws.js');
const resources = require('./resources.js');

module.exports = {
    /**
     * This provides a pre-configured AWS client.
     *
     * By default, resources will use this AWS client, however, you may
     * provide a different one.  This does not add any additional method
     * or attributes.
     */
    AWS: AWS,

    /**
     * This is a utility method for accessing CloudFormation resources.
     *
     * @param string -- The name of the stack to get the resources from
     * @param array -- The list of resources to get identifiers for
     * @param AWS -- A custom-configured AWS client, see above.
     * @return Promise<array,err> -- A Promise that if successful includes the
     *      list of physical resource identifiers.
     */
    resources: resources
}
