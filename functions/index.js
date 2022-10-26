const functions = require("firebase-functions");
const got = require('got');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.chatAi = functions.https.onRequest(async (request, response) => {
    var text=request.body.prompt;
    
    

    // This is just an example, but could be something you keep track of
    // in your application to provide OpenAI as prompt text.
    
    (async () => {
    const url = 'https://api.openai.com/v1/completions';
    const params = {
        "model": "text-davinci-002",
        'prompt': text,
        'max_tokens': 150,
        'temperature': 0.9,
        'frequency_penalty': 0,
        'presence_penalty': 0.6,
        'top_p': 1,
        'stop': [" Human:", "GatorMate:"]
    };
    const headers = {
        'Authorization': `Bearer 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`,
    };

    try {
        const responseFromGPT = await got.post(url, { json: params, headers: headers }).json();
        output = responseFromGPT.choices[0].text;
        console.log(responseFromGPT)
        response.send(output)
    } catch (err) {
        response.send(err);
    }
    })();


});