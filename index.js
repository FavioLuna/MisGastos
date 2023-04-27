const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({etended: true}));
app.use(cors());



module.exports.handler = serverless(app)