'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
    pool.query(`select * from public."User"
     where login = '${req.body.login}' AND password = '${req.body.password}';`, (error, results) => {
        if (error) {
            throw error;
        }

        if (results.rows.length) {
            res.status(200).json({ success: true, user: results.rows[0] });
        } else {
            res.status(200).json({ success: false, message: 'Ви ввели неправильний логін або пароль' });
        }
    })
});

router.get('/personalCabinet/patient/:id', (req, res) => {
    let receptions = [], user = {};
    pool.query(`select patient."userID", patient."name", patient."surname", patient."patronymic", patient."gender", 
        patient."dateOfBirth", patient."phone", patient."address", patient."role", patient."image"
        from public."User" as patient
        where patient."userID" = ${req.params.id}`, (error, results) => {
        user = results.rows[0];

        pool.query(`select reception."receptionID", reception."reason", reception."endReception",
        reception."startReception", reception."byOrder", doctor."name" as doctorName, doctor."surname" as doctorSurname, doctor."patronymic" as doctorPatronymic 
        from public."User" as patient
        join public."Reception" as reception on patient."userID" = reception."patientID"
        join public."User" as doctor on reception."medicalWorkerID" = doctor."userID"
        where patient."userID" = ${req.params.id}`, (error, results) => {
            if (error) {
                throw error;
            }

            /*const firstItem = results.rows[0];
            const patient = {
                ID: el.
            }*/
            // res.status(200).json(results.rows);
            receptions = results.rows;

            res.status(200).json({ receptions, user });
        });
    })
});

router.get('/medicalCard/patient/:id', (req, res) => {
    pool.query(`select card."medicalCardID", consultation."consultationID", consultation."inspectionResults", 
    consultation."recomendations", consultation."diagnosis", consultation."complaint", consultation."date", 
    doctor."name", doctor."surname", doctor."patronymic"
    from public."User" as patient
    join public."MedicalCard" as card on patient."userID" = card."userID"
    join public."ConsultationResult" as consultation on consultation."medicalCardID" = card."medicalCardID"
    join public."User" as doctor on doctor."userID" = consultation."madeBy"
    where patient."userID" = ${req.params.id}`, (error, results) => {
        if (error) {
            throw error;
        }
        const medicalNotes = results.rows.map(item => {
            const doctorFullName = `${item.surname} ${item.name.charAt(0)}. ${item.patronymic.charAt(0)}.`
            return {
                ...item,
                type: 'Консультація',
                fullName:  doctorFullName
            }
        })

        if (results.rows.length) {
            res.status(200).json({ medicalNotes });
        } else {
            res.status(200).json({ success: false, message: 'У даній медичній картці немає жодного запису' });
        }
    })
})

router.post('/test', (req, res) => {
    pool.query('SELECT * FROM public."testTable";', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
    // res.json({ message: 'It is worked!' });
});

module.exports = router;