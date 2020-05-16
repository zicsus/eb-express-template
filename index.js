'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const apiRouter = require('./api/Router');

const app = express();
const logger = morgan('dev');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cookieParser());
app.use(logger);

app.use('/api', apiRouter);

app.get('/', (req, res, next) => 
{
    res.send("Hoverify");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, function () 
{
    console.log('Server running at http://localhost:' + port + '/');
});