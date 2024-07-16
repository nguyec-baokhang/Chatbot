const dotenv = require("dotenv").config();
const express = require('express');
const {runSample} = require('../DialogFlowApi/DialogFlowConnection/DialogConnection');
const bodyParser = require('body-parser');
const line = require('@line/bot-sdk');
const fs = require('fs');
const https = require('https');




const options = {
    key: fs.readFileSync('../DialogFlowApi/chatbotssl/server.key'), // replace it with your key path
    cert: fs.readFileSync('../DialogFlowApi/chatbotssl/server.crt'), // replace it with your certificate path
}



const projectId = process.env.PROJECT_ID 
const uuid = require('uuid');


const app = express();
const PORT = process.env.PORT || 7000
const httpsServer = https.createServer(options, app);

const credentialsPath = process.env.CREDENTIALS_PATH 

process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath


// create LINE SDK config from env variables
const config = {
    channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const handleEvent = async (event) => {
    switch (event.type) {
        case 'join':
        case 'follow':
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'hello~'
          });   
        case 'message':
          switch (event.message.type) {
              case 'text':
                  const response = await runSample(event.message.text,projectId);
                  // you will get response from DF here
              return client.replyMessage(event.replyToken, {
                type: 'text',
                text: (response+'~yu')
              });
          }
      }
}

// register a webhook handler with middleware
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
      .all(req.body.events.map(handleEvent))
      .then(function(result) {
      res.json(result);
      });
});

app.get('/', (req,res) => {
    res.status(200).json({message:"Here I am"});
});



const start = async () => {
    try {
        httpsServer.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (error) {
      console.log(error)  
    }
}

start()
