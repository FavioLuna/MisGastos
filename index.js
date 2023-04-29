const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');
const userRoutes = require('./routes/userRoutes')
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//app.use('/users',userRoutes);
app.use('/api', userRoutes)


module.exports.handler = serverless(app)