const {v4: uuidv4} = require('uuid');

// Temporary in-memory storage map
const receipts = {};

// User
// {
//      key=userId, value = submitted count
// {
const users = {};

/**
 * Check if the receipt ID exists in the receipts object.
 * @param {string} receiptId - The receipt ID.
 * @returns {boolean} - True if the receipt ID exists, otherwise false.
 */
function isReceiptIdExist(receiptId) {
    return receipts[receiptId];
}

/**
 * Process the receipt and calculate the points.
 * @param receipt
 * @returns {string | Uint8Array}
 */
function processReceipt(receipt) {
    const receiptId = uuidv4();
    receipts[receiptId] = calculatePoints(receipt);
    return receiptId;
}

/**
 * Validate the receipt object, checking for required fields and field types.
 * @param receipt
 */
function validateReceipt(receipt) {
    if (!receipt || typeof receipt !== 'object') {
        throw new Error('The receipt is invalid.');
    }

    if (!receipt.retailer || !receipt.total || !receipt.items || !receipt.purchaseDate || !receipt.purchaseTime || !receipt.userId) {
        throw new Error('The receipt is invalid.');
    }

    if (typeof receipt.retailer !== 'string' || typeof receipt.total !== 'string' || !Array.isArray(receipt.items) || typeof receipt.purchaseDate !== 'string' || typeof receipt.purchaseTime !== 'string' || typeof receipt.userId !== 'string') {
        throw new Error('The receipt is invalid.');
    }

    if (receipt.items.some(item => typeof item.shortDescription !== 'string' || typeof item.price !== 'string')) {
        throw new Error('The receipt is invalid.');
    }

    // Validate fields using regex patterns
    const retailerPattern = /^[\w\s\-&]+$/;
    const totalPattern = /^\d+\.\d{2}$/;
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^\d{2}:\d{2}$/;
    const itemDescriptionPattern = /^[\w\s\-]+$/;
    const itemPricePattern = /^\d+\.\d{2}$/;

    if (!retailerPattern.test(receipt.retailer) || !totalPattern.test(receipt.total) || !datePattern.test(receipt.purchaseDate) || !timePattern.test(receipt.purchaseTime)) {
        throw new Error('The receipt is invalid.');
    }

    if (receipt.items.some(item => !itemDescriptionPattern.test(item.shortDescription) || !itemPricePattern.test(item.price))) {
        throw new Error('The receipt is invalid.');
    }
}

/**
 * Calculate the points for the receipt, based on the following criteria:
 * 1. 1 point for every alphanumeric character in the retailer name.
 * 2. 50 points if the total is a round dollar amount with no cents.
 * 3. 25 points if the total is a multiple of 0.25.
 * 4. 5 points for every two items on the receipt.
 * 5. 0.2*price points for item descriptions that are a multiple of 3 in length.
 * 6. 6 points if the day in the purchase date is odd.
 * 7. 10 points if the time of purchase is after 2:00pm and before 4:00pm.
 * @param receipt
 * @returns {number}
 */
function calculatePoints(receipt) {
    let points = 0;

    // 1 point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-z0-9]/gi, '').length;

    // 50 points if the total is a round dollar amount with no cents
    if (parseFloat(receipt.total) % 1 === 0) {
        points += 50;
    }

    // 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
        points += 25;
    }

    // 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;

    // 0.2*price points for item descriptions that are a multiple of 3 in length. round up to the nearest integer.
    receipt.items.forEach(item => {
        if (item.shortDescription.trim().length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getDate() % 2 !== 0) {
        points += 6;
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const [hours, minutes] = receipt.purchaseTime.split(':').map(Number);
    if (hours >= 14 && hours < 16) {
        points += 10;
    }

    // award bonus points for new users: 1000 points for the first receipt, 500 points for the second receipt and 250 points for the third receipt.
    if (!users.keys.includes(receipt.userId)) {
        users.userId = 1;
        points += 1000
    } else {
        const count = users.userId++;
        if (count === 2) points += 500;
        if (count === 3) points += 250;
    }


    return points;
}

/**
 * Get the points for the receipt with the specified ID.
 * @param {string} receiptId - The receipt ID.
 * @returns {number} - The points for the receipt.
 */
function getPoints(receiptId) {
    return receipts[receiptId];
}

module.exports = {
    processReceipt, getPoints, isReceiptIdExist, validateReceipt
};