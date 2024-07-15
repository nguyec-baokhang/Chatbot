const dotenv = require("dotenv").config();
const express = require('express');
const {runSample} = require('../DialogFlowApi/DialogFlowConnection/DialogConnection');


const app = express();
const PORT = process.env.PORT || 7000

const credentialsPath = process.env.CREDENTIALS_PATH 

process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath

app.get("/", async (req, res) => {
    try {
        const result = await runSample();
        return res.status(200).json({message: "Success", result})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server error", error})
    }
})


const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (error) {
      console.log(error)  
    }
}

start()