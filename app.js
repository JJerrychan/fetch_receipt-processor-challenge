const express = require('express');
const app = express();
const configRoutes = require('./routes');

// Middleware to log requests
app.use((req, res, next) => {
    const currentTime = new Date().toUTCString();
    const method = req.method;
    const route = req.originalUrl;
    const ip = req.ip;
    console.log(`[${currentTime}]: ${method} ${route} from ${ip}`);
    next();
});

// Middleware to handle JSON syntax errors
app.use(express.json(), (err, req, res, next) => {
    console.error('JSON Syntax Error: ' + err.message);
    res.status(400).json({error: 'JSON Syntax Error'});
});

// Middleware to parse POST request body
app.use(express.urlencoded({extended: true}));

configRoutes(app);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal Server Error'});
});

const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});