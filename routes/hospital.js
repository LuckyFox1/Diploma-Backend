'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/hospital/beds', (req, res) => {
    pool.query(`select room."number" as room, bed."userID", bed."number", bed."hospitalizationTerm", u."name", 
    u."surname", u."patronymic" 
    from public."HospitalRoom" as room
    left join public."HospitalBed" as bed on bed."roomNumber" = room."number"
    left join public."User" as u on  bed."userID" = u."userID"
    order by bed."number"`, (error, results) => {
        if (error) {
            throw error;
        }

        const beds = results.rows ? results.rows : [];
        let groupedByRoom = {};

        for (let i = 0; i < beds.length; i++) {
            const room = beds[i].room;

            if (!Object.keys(groupedByRoom).some(item => item.room === room)) {
                const group = beds.filter(item => item.room === room);
                groupedByRoom[room] = group;
            }
        }

        res.status(200).json({ rooms: groupedByRoom });
    })
});

module.exports = router;
