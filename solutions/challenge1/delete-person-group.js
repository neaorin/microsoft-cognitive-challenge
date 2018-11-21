// This script will delete a Person Group

'use strict';

// Replace <Face API base URI> with your valid Face API base URI.
const uriBase = '<Face API base URI>';
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '<Subscription Key>';




const rp = require('request-promise');
const groupname = 'Politicieni'
const groupid = 'ee908a56-e4a1-44b3-8101-c339fa27a904'

async function deletePersonGroup() {

    try {

        // Delete Person Group

        let options = {
            uri: `${uriBase}/persongroups/${groupid}`,
            method: 'delete',
            headers: {
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };

        console.log(`Delete Person Group ${groupname}...`);
        await rp(options);
        console.log(`Person Group ${groupname} deleted.`);
    }

    catch (error) {
        Promise.reject(error);
    }
}


deletePersonGroup()
    .then(function() {
        console.log(`ALL DONE.`); 
    })
    .catch (function(error) {
        console.log(`ERROR: ${error}`);
    });

