'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/labs', (req, res) => {
    pool.query(`select *
    from public."AnalysisForm" as form
    join public."AnalysisFormProperty" as cross_tbl on form."analysisFormID" = cross_tbl."formID"
    join public."FormProperty" as prop on cross_tbl."propertyID" = prop."propertyID"
    order by form."analysisFormID", prop."propertyID"`, (error, results) => {
        if (error) {
            throw error;
        }
        const labs = results.rows ? results.rows : [];
        let groupedByForm = {};

        for (let i = 0; i < labs.length; i++) {
            const labID = labs[i].analysisFormID;

            if (!Object.keys(groupedByForm).some(item => item.analysisFormID === labID)) {
                const group = labs.filter(item => item.analysisFormID === labID);

                groupedByForm[labID] = {
                    title: labs[i].title,
                    properties: group
                }
            }
        }

        res.status(200).json({ labs: groupedByForm });
    })
});

module.exports = router;