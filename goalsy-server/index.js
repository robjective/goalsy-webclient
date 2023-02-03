const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const prompts = require('./prompts.json');

const configuration = new Configuration({
    organization: "org-kx5iubitmzRJREHO06uLSMmV",
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// create a simple express api that calls the function above
const { response } = require("express");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3080;


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:/${port}`)
});

app.post('/', async (req, res) => {
    try {
        if (req.body.prompt==0){
            const message = prompts[0].prompt.concat(req.body.message);
            console.log("message:",message);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${message}`,
                max_tokens: 150,
                temperature: .8,
            });
            console.log("\nresponse:",response.data.choices[0].text.trim());
            res.json({
                message:response.data.choices[0].text.trim(), });
                //remove any leading or trailing line breaks from the response


        }
        else if (req.body.prompt==1){
            const message = prompts[1].prompt.concat(req.body.message);
            console.log("message:",message);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${message}`,
                max_tokens: 150,
                temperature: 0,
            });
            console.log("response:",response.data.choices[0].text);
            res.json({
                message:response.data.choices[0].text, });
        }
        else if (req.body.prompt==2){
            console.log("message:",req.body.customPrompt);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${req.body.customPrompt}`,
                max_tokens: 800,
                temperature: 0,
            });
            console.log("response:",response.data.choices[0].text);
            res.json({
                message:response.data.choices[0].text, });
        }
        else {
            console.log("req.body.message:",req.body.message);
            const message = prompts[req.body.prompt].prompt.concat(req.body.message);
            console.log("message:",message);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${message}`,
                max_tokens: 200,
                temperature: .5,
            });
            console.log("response:",response.data.choices[0].text);
            res.json({
                message:response.data.choices[0].text.trim(), });
        }
        // remove any leading or trailing whitespace from the response
        


        }
    catch(err){
        console.log("error",err.description);
    }
})
