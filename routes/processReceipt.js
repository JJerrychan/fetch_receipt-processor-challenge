const express = require('express');
const router = express.Router();
const {processReceipt, validateReceipt} = require('../data/receiptsStore');

router.post('/', async (req, res) => {
    const receipt = req.body;
    try {
        validateReceipt(receipt);
    } catch (error) {
        res.status(400).json({'message': error.message});
        return;
    }
    try {
        const receiptId = processReceipt(receipt);
        res.json({id: receiptId});
    } catch (error) {
        console.error('Error processing receipt:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;