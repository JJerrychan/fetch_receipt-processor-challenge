const express = require('express');
const {getPoints, isReceiptIdExist} = require("../data");
const router = express.Router();

router.get('/:id/points', async (req, res) => {
    //no validation for id
    const receiptId = req.params.id;
    try {
        if (!isReceiptIdExist(receiptId)) {
            res.status(404).json({Messages: 'No receipt found for that ID.'});
            return;
        }
        const points = getPoints(receiptId);
        res.json({points: points});
    } catch (error) {
        console.error('Error getting points:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;