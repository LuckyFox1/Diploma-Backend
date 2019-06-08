'use strict';

const express = require('express');

const router = express.Router();

/*router.get('/like/metcast/:metcastId', (req, res, next) => {
    Like.find({metcast_id: req.params.metcastId}).populate('metcast_id')
        .then(like => {
            res.json({like});
        })
        .catch(next);
});*/

module.exports = router;