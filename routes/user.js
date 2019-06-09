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

router.get('/personalCabinet/:role/:id', (req, res) => {
    let receptions = [], user = {};
    const doctorProperties = req.params.role === 'doctor'
        ? `, doctor."position", doctor."startWorkDay", doctor."endWorkDay", doctor."startDinner", doctor."endDinner", 
        doctor."roomNumber", doctor."receptionDuration" `
        : '';
    const joinMedicalWorker = req.params.role === 'doctor'
        ? ` join public."MedicalWorker" as doctor on doctor."userID" = u."userID"` : '';
    pool.query(`select u."userID", u."name", u."surname", u."patronymic", u."gender", 
        u."dateOfBirth", u."phone", u."address", u."role", u."image"${doctorProperties}
        from public."User" as u ${joinMedicalWorker}
        where u."userID" = ${req.params.id}`, (error, results) => {
        user = results.rows[0];
        const receptionQuery = req.params.role === 'patient'
        ? `select reception."receptionID", reception."reason", reception."endReception",
        reception."startReception", reception."byOrder", doctor."name" as doctorName, doctor."surname" as doctorSurname, doctor."patronymic" as doctorPatronymic 
        from public."User" as patient
        join public."Reception" as reception on patient."userID" = reception."patientID"
        join public."User" as doctor on reception."medicalWorkerID" = doctor."userID"
        where patient."userID" = ${req.params.id}`
        : `select reception."receptionID", reception."reason", reception."endReception", reception."startReception", 
        reception."byOrder", patient."name" as patientName, patient."surname" as patientSurname, 
        patient."patronymic" as patientPatronymic 
        from public."User" as doctor
        join public."Reception" as reception on doctor."userID" = reception."medicalWorkerID"
        join public."User" as patient on reception."patientID" = patient."userID"
        where doctor."userID" = ${req.params.id}`;

        pool.query(receptionQuery, (error, results) => {
            if (error) {
                throw error;
            }

            /*const firstItem = results.rows[0];
            const patient = {
                ID: el.
            }*/
            // res.status(200).json(results.rows);
            receptions = results.rows ? results.rows : [];

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