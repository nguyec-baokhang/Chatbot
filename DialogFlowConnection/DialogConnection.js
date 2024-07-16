const express = require("express");

const dialogflow = require("dialogflow");
const OpenAIAPI = require('openai');



//Initialize OpenAI API with the secret key
const openai = new OpenAIAPI(process.env.OPENAI_API_KEY);

const askGPT = async (question) => {
  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
          role: 'system',
          content: 'You are a helpful assistant.'
      },
      {
          role: 'user',
          content: question,
      }
  ],
  });
  return gptResponse.choices[0].message;
}

const runSample = async (message, projectId) => {
    // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult.fulfillmentText;
  const queryText = responses[0].queryResult.queryText;

  const action = responses[0].queryResult.action;
  if (action == "input.unknown"){
    const new_result = await askGPT(queryText);
    // return {
    //   user: queryText,
    //   bot: new_result
    // }
    return new_result;
  }


  if (result) {
        // return {
        //     user: queryText,
        //     bot: result
        // }
        return result;
}else{
    return Error("No intent matched")
}
}

module.exports = {runSample};