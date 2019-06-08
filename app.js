'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const config = require('./config');

const app = express();
app.use(cookieParser());
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});

app.use((req, res, next) => {
    const err = new Error(`Not Found ${req.path}`);
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    if (error) {
        return res.status(400).json({error: error.message || ""});
    }
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ err: err.message || "" });
});
