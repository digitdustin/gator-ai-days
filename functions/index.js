const functions = require("firebase-functions");
const got = require('got');
const dotenv = require('dotenv');
const language = require('@google-cloud/language');
const cors = require('cors')({origin: true});
dotenv.config();

exports.chatAi = functions.https.onRequest(async (request, response) => {
    cors(request, response, async() => {
       
        console.log(request.body)
        console.log(request.body.prompt)
        var index=request.body.index
        var level = ""
        if (index == 0){
            level = "a child"
        }
        if (index == 1){
            level = "a young adult"
        }
        if (index == 2){
            level = "a high-schooler"
        }
        if (index == 2){
            level = "an adult"
        }

        var starting = `The following is a conversation with an AI assistant. The assistant is helpful, clever, very friendly, and for ${level}.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: `
        var text = request.body.prompt;
        
        (async () => {
        const url = 'https://api.openai.com/v1/completions';
        const params = {
            "model": "text-davinci-002",
            'prompt': starting+text,
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
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Headers', '*');
        response.set('Content-Type', 'application/json');

        try {
            const responseFromGPT = await got.post(url, { json: params, headers: headers }).json();
            output = responseFromGPT.choices[0].text;
            response.send(output)
        } catch (err) {
            response.send(err);
        }
        })();
      });
});


exports.explain = functions.https.onRequest(async (request, response) => {

    cors(request, response, async() => {
    
        console.log(request.body)
        console.log(request.body.prompt)
        var index=request.body.index
        var level = ""
        if (index == 0){
            level = "a child"
        }
        if (index == 1){
            level = "a young adult"
        }
        if (index == 2){
            level = "a high-schooler"
        }
        if (index == 2){
            level = "an adult"
        }
        var text = "Answer this question in 2 paragraphs format for "+ level + ":\n\n"+request.body.prompt;
        
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

            response.set('Access-Control-Allow-Origin', '*');
            response.set('Access-Control-Allow-Headers', '*');
            response.set('Content-Type', 'application/json');
            try {
                const responseFromGPT = await got.post(url, { json: params, headers: headers }).json();
                output = responseFromGPT.choices[0].text;
                response.send(request.body.prompt+output)
            } catch (err) {
                response.send(err);
            }
            })();
        });
});

exports.getEntities = functions.https.onRequest(async (request, response) => {
    cors(request, response, async() => {
        var text = request.body.prompt;
        
        const client = new language.LanguageServiceClient(
            {
                projectID:"ai-hacks-gatormate",
                keyFilename:"creds.json"
            }
        );

        const document = {
            content: text,
            type: 'PLAIN_TEXT'
        };
        
        const [result] = await client.analyzeEntities({document});
        const wikis = [];

        const entities = result.entities;
        entities.forEach(entity => {
            if(entity.metadata && entity.metadata.wikipedia_url) {
                wikis.push(entity.metadata.wikipedia_url);
            }
        });
        entities.sort((a,b) => {
            if(a.salience > b.salience)
                return a;
            else   
                return b;
        });
        response.send({input: request.body.prompt, output: entities});
        console.log(`Entities: ${entities}`);
    });
});

exports.getNews = functions.https.onRequest(async (request, response) => {
   cors(request, response, async() => {
        const NewsAPI = require('newsapi');
        const newsapi = new NewsAPI('2ebba9cd2f3f46568c1d31dcdaffbfad');
    
        var text = request.body.prompt;
        var lang = request.body.language;

        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Headers', '*');
        response.set('Content-Type', 'application/json');

        newsapi.v2.everything({
            q: text,
            language: lang,
            pageSize: 5,
            sortBy: 'relevancy'
        }).then(data => {
            response.send({input: request.body.prompt, output: data});
        });
   });
});

exports.getResearch = functions.https.onRequest(async (request, response) => {
    cors(request, response, async() => {
        const arxiv = require('arxiv-api');

        var keyword = request.body.prompt;

        const papers = await arxiv.search({
            searchQueryParams: [
                {
                    include: [{name: `${keyword}`}],
                }
            ],
            start: 0,
            maxResults: 5,
        });
        response.send({input: request.body.prompt, output: papers});
    })
});