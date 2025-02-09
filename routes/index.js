const getPoints = require('./getPoints');
const processReceipt = require('./processReceipt');

function constructor(app) {
    app.use('/receipts/process', processReceipt);
    app.use('/receipts/', getPoints);
    app.use('*', async (req, res) => {
        res.status(404).json({Error: 'Not found'});
    });
}

module.exports = constructor;