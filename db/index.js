/*
'use strict';

const mongoose = require('mongoose'),
    config = require('../config');

mongoose.Promise = global.Promise;

mongoose.connect(config.mongoUrl, { useMongoClient: true }, err => {
    if (err) throw err;
});

process.on('SIGINT', () => {
    mongoose.disconnect()
        .then(() => {
            console.log('Disconnected');
            process.exit();
        });
});

module.exports = mongoose;*/
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'MIS',
    password: '111',
    port: 5432,
});

module.exports = pool;