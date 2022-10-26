const functions = require("firebase-functions");
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.chatAi = functions.https.onRequest(async (request, response) => {
    var text=request.body.prompt;
    
    var level=""
    if (index==0){
        level="a child"
    }
    if (index==1){
        level="a young adult"
    }
    if (index==2){
        level="a high-schooler"
    }
    if (index==2){
        level="an adult"
    }

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
        'stop': [" Human:", " AI:"]
    };
    
    const headers = {
        'Authorization': `Bearer ${process.env.KEY}`,
    };

    try {
        const responseFromGPT = await got.post(url, { json: params, headers: headers }).json();
        output = responseFromGPT.choices[0].text;
        response.send(output)
    } catch (err) {
        response.send(err);
    }
    })();


});


exports.explain = functions.https.onRequest(async (request, response) => {
    var index=request.body.index
    var level=""
    if (index==0){
        level="a child"
    }
    if (index==1){
        level="a young adult"
    }
    if (index==2){
        level="a high-schooler"
    }
    if (index==2){
        level="an adult"
    }
    var text="Answer this question in 2 paragraphs format for "+ level + ":\n\n"+request.body.prompt;
    
    

    // This is just an example, but could be something you keep track of
    // in your application to provide OpenAI as prompt text.
    
    (async () => {
    const url = 'https://api.openai.com/v1/completions';
    const params = {
        "model": "text-davinci-002",
        'prompt': text,
        'max_tokens': 1500,
        'temperature': 0.7,
        'frequency_penalty': 0,
        'presence_penalty': 0,
        'top_p': 1
    };
    
    const headers = {
        'Authorization': `Bearer ${process.env.KEY}`,
    };

    try {
        const responseFromGPT = await got.post(url, { json: params, headers: headers }).json();
        output = responseFromGPT.choices[0].text;
        response.send(request.body.prompt+output)
    } catch (err) {
        response.send(err);
    }
    })();


});
