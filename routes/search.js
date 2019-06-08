'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/search', (req, res) => {
    const { role, searchStr } = req.body;
    const medicalWorkerJoin = role === 'doctor'
        ? `join public."MedicalWorker" as doctor on u."userID" = doctor."userID"` : ''
    const searchArr = searchStr.split(' ').filter(item => {
        return item.length !== 0;
    });
    let searchQuery = '';

    for (let i = 0; i < searchArr.length; i++) {
        searchQuery += `(u."name" like '%${searchArr[i]}%' or u."surname" like '%${searchArr[i]}%' or u."patronymic" like '%${searchArr[i]}%')`;

        if (i !== searchArr.length - 1) {
            searchQuery += ' and ';
        }
    }

    pool.query(`SELECT * from public."User" as u ${medicalWorkerJoin} 
    where (${searchQuery}) and u."role" = '${role}'`, (error, results) => {
        if (error) {
            throw error;
        }

        if (results.rows.length) {
            res.status(200).json({ success: true, users: results.rows });
        } else {
            res.status(200).json({ success: false, message: 'За вашим запитом не знайдено жодного результату...' });
        }
    })
});

module.exports = router;