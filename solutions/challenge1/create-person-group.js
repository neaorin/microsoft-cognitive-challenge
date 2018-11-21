// This script will create a Person Group, a Person with face images for training, and train the group.

'use strict';

// Replace <Face API base URI> with your valid Face API base URI.
const uriBase = '<Face API base URI>';
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '<Subscription Key>';




const rp = require('request-promise');
const groupname = 'Politicieni'
const personname = 'Liviu D'
const groupid = 'ee908a56-e4a1-44b3-8101-c339fa27a904'
const pictureUrls = [
    'https://raw.githubusercontent.com/neaorin/microsoft-cognitive-challenge/master/media/liviu01.jpg',
    'https://raw.githubusercontent.com/neaorin/microsoft-cognitive-challenge/master/media/liviu02.jpg',
    'https://raw.githubusercontent.com/neaorin/microsoft-cognitive-challenge/master/media/liviu03.jpg'
]

async function createAndTrainPersonGroup() {

    try {

        // Create Person Group

        let options = {
            uri: `${uriBase}/persongroups/${groupid}`,
            method: 'put',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            },
            body: {
                "name": groupname,
                "userData": "98af8eaf-5ad4-408e-a4d6-441225f22a1f"
            }
        };

        console.log(`Creating Person Group ${groupname}...`);
        await rp(options);
        console.log(`Person Group ${groupname} created.`);

        // Create Person

        let options2 = {
            uri: `${uriBase}/persongroups/${groupid}/persons`,
            method: 'post',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            },
            body: {
                "name": personname,
                "userData": "98af8eaf-5ad4-408e-a4d6-441225f22a1f"
            }
        };
        console.log(`Creating Person ${personname}...`);
        const response2 = await rp(options2);
        console.log(`Person ${personname} created.`);
        const personId = response2.personId;
        console.log(`The new Person's Id is ${personId}.`);

        // Upload faces of person

        for (const picUrl of pictureUrls) {
            let options3 = {
                uri: `${uriBase}/persongroups/${groupid}/persons/${personId}/persistedFaces`,
                method: 'post',
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key' : subscriptionKey
                },
                body: {
                    "url": picUrl
                }
            };

            console.log(`Adding picture ${picUrl}...`);
            await rp(options3);
            console.log(`Picture ${picUrl} added.`);
        }

        // Train model

        let options4 = {
            uri: `${uriBase}/persongroups/${groupid}/train`,
            method: 'post',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };
        console.log(`Training group ${groupname}...`);
        await rp(options4);
        console.log(`Group ${groupname} scheduled for training.`);

    }

    catch (error) {
        Promise.reject(error);
    }
}


createAndTrainPersonGroup()
    .then(function() {
        console.log(`ALL DONE.`); 
    })
    .catch (function(error) {
        console.log(`ERROR: ${error}`);
    });

