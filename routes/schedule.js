'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/schedule/doctor/:id', (req, res) => {
    pool.query(`SELECT * from public."User" as doctor
    join public."MedicalWorker" as info on info."userID" = doctor."userID"
    where doctor."userID" = '${req.params.id}'`, (error, results) => {
        if (error) {
            throw error;
        }

        res.status(200).json({ user: results.rows[0] });
    })
});

module.exports = router;