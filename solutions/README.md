# Bucharest.AI & Microsoft Cognitive Challenge - Sample Solutions

This folder contains sample solutions for the Bucharest.AI & Microsoft Cognitive Services Challenge.

# Prerequisites

1. Install [Node.js](https://nodejs.org/en/).

# Running the solutions

1. Open a command prompt in this folder.

2. Navigate to the subfolder for the  challenge of your choice. For example:

    `cd challenge1`

3. Install the solution prerequisites.

    `npm install`

4. Open the `predict.js` file inside the solution and input your Cognitive Services API URL and Subscription Key into the placeholders.

    ```js
    // Replace <Face API base URI> with your valid Face API base URI.
    const uriBase = '<Face API base URI>';
    // Replace <Subscription Key> with your valid subscription key.
    const subscriptionKey = '<Subscription Key>';
    ```

    > NOTE: `challenge1` will require a Face API key and URL, while `challenge2` and `challenge3` will require a Custom Vision Prediction Key and URL.

5. Run the solution

    `npm start`

6. Select an image and hit *Predict*. You should see the results in the main application window.

7. (Optional) for `challenge1`, you can use the `create-person-group.js` script to automatically create and populate a Person Group with example images for a specific Person. The application will then recognize the specific individual.