const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');
const userRoutes = require('./routes/userRoutes')
const spentRoutes = require('./routes/spentRoutes');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


app.use('/api', userRoutes);
app.use('/api', spentRoutes);

module.exports.handler = serverless(app)